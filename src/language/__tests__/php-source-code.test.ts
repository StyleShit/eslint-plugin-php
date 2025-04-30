import { type Class, type ClassConstant } from 'php-parser';
import { describe, expect, it } from 'vitest';
import { type File } from '@eslint/core';

import { PHPLanguage } from '../php-language';
import { PHPSourceCode } from '../php-source-code';

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

	it('should return inline configs', () => {
		// Arrange.
		const code = `<?php
			/* Valid rule config comments: */
			/* eslint php/test-rule: error */
			/* eslint php/test-rule: [1] */
			/* eslint php/test-rule: [1, { option: 2 }] */

			/* Invalid rule config comments: */
			/* eslint php/test-rule: [error */
			/* eslint php/test-rule: [1, { allow: ["foo"] ] */
		`;

		const sourceCode = createSourceCode(code);
		const allComments = sourceCode.comments;

		// Act.
		const config = sourceCode.applyInlineConfig();

		// Assert.
		expect(config.configs).toStrictEqual([
			{
				config: {
					rules: {
						'php/test-rule': 'error',
					},
				},
				loc: allComments[1]?.loc,
			},
			{
				config: {
					rules: {
						'php/test-rule': [1],
					},
				},
				loc: allComments[2]?.loc,
			},
			{
				config: {
					rules: {
						'php/test-rule': [1, { option: 2 }],
					},
				},
				loc: allComments[3]?.loc,
			},
		]);

		expect(config.problems).toHaveLength(2);
		expect(config.problems[0]?.loc).toStrictEqual(allComments[5]?.loc);
		expect(config.problems[1]?.loc).toStrictEqual(allComments[6]?.loc);
	});

	it('should return disable directives', () => {
		// Arrange.
		const code = `<?php
			/* Valid directives: */
			/* eslint-disable php/test-rule -- ok here */
			/* eslint-enable */
			/* eslint-disable-next-line php/test-rule */
			/* eslint-disable-line php/test-rule -- ok here */
			// eslint-disable-line php/test-rule -- ok here

			/* Invalid directive: */
			/* eslint-disable-line php/test-rule
			*/

			/* Not disable directive: */
			/* eslint-disable- */
			// eslint-disable-
		`;

		const sourceCode = createSourceCode(code);
		const allComments = sourceCode.comments;

		// Act.
		const { directives, problems } = sourceCode.getDisableDirectives();

		// Assert.
		// eslint-disable-next-line @typescript-eslint/no-misused-spread -- Intentional for easier equality check.
		expect(directives.map((d) => ({ ...d }))).toStrictEqual([
			{
				type: 'disable',
				value: 'php/test-rule',
				justification: 'ok here',
				node: allComments[1],
			},
			{
				type: 'enable',
				value: '',
				justification: '',
				node: allComments[2],
			},
			{
				type: 'disable-next-line',
				value: 'php/test-rule',
				justification: '',
				node: allComments[3],
			},
			{
				type: 'disable-line',
				value: 'php/test-rule',
				justification: 'ok here',
				node: allComments[4],
			},
			{
				type: 'disable-line',
				value: 'php/test-rule',
				justification: 'ok here',
				node: allComments[5],
			},
		]);

		expect(problems).toStrictEqual([
			{
				ruleId: null,
				loc: allComments[7]?.loc,
				message:
					'eslint-disable-line comment should not span multiple lines.',
			},
		]);
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
