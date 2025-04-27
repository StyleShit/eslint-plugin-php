import { RuleTester, type Rule } from 'eslint';
import php from '../../index';
import { noAssignRef } from '../no-assign-ref';

const ruleTester = new RuleTester({
	plugins: {
		php,
	},
	language: 'php/php',
});

// TODO: Fix the types.
ruleTester.run('no-assign-ref', noAssignRef as unknown as Rule.RuleModule, {
	valid: ['<?php $a = [];'],
	invalid: [
		{
			code: '<?php $a = [1, 2, 3]; $my_var = &$a;',
			errors: [
				{
					messageId: 'noAssignRef',
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 37,
				},
			],
			output: '<?php $a = [1, 2, 3]; $my_var = $a;',
		},
		{
			code: '<?php function passByRef(&$var) { return []; }',
			errors: [
				{
					messageId: 'noAssignRef',
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 31,
				},
			],
			output: '<?php function passByRef($var) { return []; }',
		},
	],
});
