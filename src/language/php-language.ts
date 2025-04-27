import type { File, Language, OkParseResult, ParseResult } from '@eslint/core';
import { Engine, type Program } from 'php-parser';
import { PHPSourceCode } from './php-source-code';

export const LINE_START = 1 as const;
export const COLUMN_START = 0 as const;

export class PHPLanguage implements Language {
	fileType = 'text' as const;

	lineStart = LINE_START;

	columnStart = COLUMN_START;

	nodeTypeKey = 'kind';

	#engine: Engine;

	constructor() {
		this.#engine = new Engine({
			parser: {
				extractDoc: true,
			},
			ast: {
				withPositions: true,
			},
		});
	}

	// Required by the interface.
	validateLanguageOptions() {}

	parse(file: File): ParseResult<Program> {
		if (typeof file.body !== 'string') {
			return {
				ok: false,
				errors: [
					{
						message: "File's body is unreadable.",
						line: this.lineStart,
						column: this.columnStart,
					},
				],
			};
		}

		try {
			const ast = this.#engine.parseCode(file.body, file.path);

			return {
				ok: true,
				ast,
			};
		} catch {
			return {
				ok: false,
				errors: [
					{
						message: 'File cannot be parsed',
						line: this.lineStart,
						column: this.columnStart,
					},
				],
			};
		}
	}

	createSourceCode(file: File, input: OkParseResult<Program>) {
		return new PHPSourceCode({
			ast: input.ast,

			// Must be a string at this point, since this function is only called if the parse was successful.
			text: file.body as string,
		});
	}
}
