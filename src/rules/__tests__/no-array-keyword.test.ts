import { RuleTester, type Rule } from 'eslint';
import * as php from '../../index';
import { noArrayKeyword } from '../no-array-keyword';

const ruleTester = new RuleTester({
	plugins: {
		php,
	},
	language: 'php/php',
});

// TODO: Fix the types.
ruleTester.run(
	'no-array-keyword',
	noArrayKeyword as unknown as Rule.RuleModule,
	{
		valid: ['<?php $a = [];'],
		invalid: [
			{
				name: 'single line',
				code: '<?php $a = array(1, 2, 3);',
				errors: [
					{
						messageId: 'noArrayKeyword',
						line: 1,
						column: 12,
						endLine: 1,
						endColumn: 26,
					},
				],
				output: '<?php $a = [1, 2, 3];',
			},
			{
				name: 'multiline',
				code: `<?php
					$a = array(
						1,
						2,
						3,
					);
				`,
				errors: [
					{
						messageId: 'noArrayKeyword',
						line: 2,
						column: 11,
						endLine: 6,
						endColumn: 7,
					},
				],
				output: `<?php
					$a = [
						1,
						2,
						3,
					];
				`,
			},
		],
	},
);
