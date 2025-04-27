import type {
	DirectiveType,
	FileProblem,
	RulesConfig,
	SourceLocation,
} from '@eslint/core';
import {
	ConfigCommentParser,
	Directive,
	TextSourceCodeBase,
} from '@eslint/plugin-kit';
import type { Comment, Location, Program } from 'php-parser';

type NormalizedComment = {
	value: string;
	loc: Location | null;
};

type InlineConfigElement = {
	config: { rules: RulesConfig };
	loc: SourceLocation;
};

const INLINE_CONFIG =
	/^\s*(?:eslint(?:-enable|-disable(?:(?:-next)?-line)?)?)(?:\s|$)/u;

const ESLINT_DIRECTIVES = [
	'eslint-disable',
	'eslint-enable',
	'eslint-disable-next-line',
	'eslint-disable-line',
];

const commentParser = new ConfigCommentParser();

/**
 * This class is heavily inspired by `@eslint/json` & `@eslint/css`:
 *
 * @see https://github.com/eslint/json/blob/42cca7789/src/languages/json-source-code.js
 * @see https://github.com/eslint/css/blob/fa391df2c/src/languages/css-source-code.js
 */
export abstract class TextSourceCodeWithComments extends TextSourceCodeBase {
	#inlineConfigComments: NormalizedComment[] | null = null;

	public override ast: Program;
	public override text: string;
	public comments: NormalizedComment[];

	constructor({ ast, text }: { ast: Program; text: string }) {
		super({ ast, text });

		this.ast = ast;
		this.text = text;
		this.comments = this.normalizeComments(ast.comments ?? []);
	}

	private normalizeComments(comments: Comment[]): NormalizedComment[] {
		return comments.reduce<NormalizedComment[]>((acc, comment) => {
			if (!comment.loc) {
				return acc;
			}

			if (comment.kind === 'commentblock') {
				acc.push({
					value: comment.value
						.replace(/^\/\*\s*(.*?)\s*\*\/$/gm, '$1')
						.trim(),
					loc: comment.loc,
				});
			}

			if (comment.kind === 'commentline') {
				// `php-parser` sets the end line wrong.
				comment.loc.end.line = comment.loc.start.line;

				acc.push({
					value: comment.value.replace(/^\/\/\s*/gm, '').trim(),
					loc: comment.loc,
				});
			}

			return acc;
		}, []);
	}

	getInlineConfigNodes() {
		if (!this.#inlineConfigComments) {
			this.#inlineConfigComments = this.comments.filter((comment) =>
				INLINE_CONFIG.test(comment.value),
			);
		}

		return this.#inlineConfigComments;
	}

	getDisableDirectives() {
		const problems: FileProblem[] = [];
		const directives: Directive[] = [];

		this.getInlineConfigNodes().forEach((comment) => {
			const parsedComment = commentParser.parseDirective(comment.value);

			if (!parsedComment || !comment.loc) {
				return;
			}

			const { label, value, justification } = parsedComment;

			// `eslint-disable-line` directives are not allowed to span multiple lines as it would be confusing to which lines they apply
			if (
				label === 'eslint-disable-line' &&
				comment.loc.start.line !== comment.loc.end.line
			) {
				const message = `${label} comment should not span multiple lines.`;

				problems.push({
					ruleId: null,
					message,
					loc: comment.loc,
				});

				return;
			}

			if (ESLINT_DIRECTIVES.includes(label)) {
				const directiveType = label.replace(/^eslint-/, '');

				directives.push(
					new Directive({
						type: directiveType as DirectiveType,
						node: comment,
						value,
						justification,
					}),
				);
			}
		});

		return { problems, directives };
	}

	applyInlineConfig() {
		const problems: FileProblem[] = [];
		const configs: InlineConfigElement[] = [];

		this.getInlineConfigNodes().forEach((comment) => {
			const parsedComment = commentParser.parseDirective(comment.value);

			if (!parsedComment || !comment.loc) {
				return;
			}

			const { label, value } = parsedComment;

			if (label !== 'eslint') {
				return;
			}

			const parseResult = commentParser.parseJSONLikeConfig(value);

			if (parseResult.ok) {
				configs.push({
					config: {
						rules: parseResult.config,
					},
					loc: comment.loc,
				});

				return;
			}

			problems.push({
				ruleId: null,
				message: parseResult.error.message,
				loc: comment.loc,
			});
		});

		return {
			configs,
			problems,
		};
	}
}
