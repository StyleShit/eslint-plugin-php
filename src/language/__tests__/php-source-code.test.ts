import { describe, expect, it } from 'vitest';
import { PHPSourceCode } from '../php-source-code';
import { PHPLanguage } from '../php-language';
import { File } from '@eslint/core';
import { Class, ClassConstant } from 'php-parser';

describe('PHPSourceCode', () => {
	it('should return the closest keyword', () => {
		// Arrange.
		const code = `<?php
            class Foo {
                const BAR = 'bar',
                    BAZ = 'baz';
            }
        `;

		const sourceCode = createSourceCode(code);

		// Act.
		const classNode = sourceCode.ast.children[0] as Class;
		const barNode = classNode.body[0] as unknown as ClassConstant;

		const constKeyword = sourceCode.findClosestKeyword(barNode, 'const');
		const nonExistingKeyword = sourceCode.findClosestKeyword(
			barNode,
			'non-existing',
		);

		// Assert.
		expect(constKeyword).toStrictEqual({
			start: { line: 3, column: 16, offset: 46 },
			end: { line: 3, column: 21, offset: 51 },
		});

		expect(nonExistingKeyword).toBe(null);
	});

	it('should convert position to offset', () => {
		// Arrange.
		const code = `<?php
            class Foo {
                const BAR = 'bar',
                    BAZ = 'baz';
            }
        `;

		const sourceCode = createSourceCode(code);

		// Act.
		const classNode = sourceCode.ast.children[0] as Class;
		const barNode = classNode.body[0] as unknown as ClassConstant;
		const nodeLoc = sourceCode.getLoc(barNode);

		const offset = sourceCode.getOffset(nodeLoc.start);

		// Assert.
		expect(offset).toBe(52);
	});
});

function createSourceCode(code: string) {
	const parseResult = new PHPLanguage().parse({ body: code } as File);

	if (!parseResult.ok) {
		throw new Error('Parse failed');
	}

	return new PHPSourceCode({
		ast: parseResult.ast,
		text: code,
	});
}
