import { type Node } from 'php-parser';

import { createRule } from '../utils/create-rule';

type MessageIds = 'disallowReferences' | 'removeAmp';
type Options = [];

export const disallowReferences = createRule<MessageIds, Options>({
	meta: {
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Disallow the use of references',
		},
		messages: {
			disallowReferences: 'Do not use references (&).',
			removeAmp: 'Remove the reference operator (&).',
		},
		schema: [],
	},

	create(context) {
		return {
			[selectors.join(', ')](node: Node) {
				const ampKeyWord = context.sourceCode.findClosestKeyword(
					node,
					'&',
				);

				if (!ampKeyWord) {
					return;
				}

				context.report({
					node,
					loc: {
						start: ampKeyWord.start,
						end: context.sourceCode.getLoc(node).end,
					},
					messageId: 'disallowReferences',
					suggest: [
						{
							messageId: 'removeAmp',
							fix(fixer) {
								return fixer.removeRange([
									ampKeyWord.start.offset,
									ampKeyWord.end.offset,
								]);
							},
						},
					],
				});
			},
		};
	},
});

const selectors = [
	'Expr_AssignRef > .expr',
	'Param[byRef=true]',
	'Stmt_Function[byRef=true] > .name',
	'ClosureUse[byRef=true]',
	'Expr_Closure[byRef=true]',
	'Stmt_ClassMethod[byRef=true] > .name',
];
