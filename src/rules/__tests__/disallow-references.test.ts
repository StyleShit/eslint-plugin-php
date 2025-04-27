import { RuleTester, type Rule } from 'eslint';
import php from '../../index';
import { disallowReferences } from '../disallow-references';

const ruleTester = new RuleTester({
	plugins: {
		php,
	},
	language: 'php/php',
});

// TODO: Fix the types.
ruleTester.run(
	'disallow-references',
	disallowReferences as unknown as Rule.RuleModule,
	{
		valid: [
			'<?php $a = [];',
			'<?php function foo() {}',
			'<?php function foo($var) {}',
		],
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
						suggestions: [
							{
								desc: 'Remove the reference operator (&).',
								output: '<?php $a = [1, 2, 3]; $my_var = $a;',
							},
						],
					},
				],
			},
			{
				code: '<?php function passByRef(&$var) { return []; }',
				errors: [
					{
						messageId: 'noAssignRef',
						line: 1,
						column: 26,
						endLine: 1,
						endColumn: 31,
						suggestions: [
							{
								desc: 'Remove the reference operator (&).',
								output: '<?php function passByRef($var) { return []; }',
							},
						],
					},
				],
			},
			{
				code: '<?php function &returnByRef($var) { return []; }',
				errors: [
					{
						messageId: 'noAssignRef',
						line: 1,
						column: 7,
						endLine: 1,
						endColumn: 49,
						suggestions: [
							{
								desc: 'Remove the reference operator (&).',
								output: '<?php function returnByRef($var) { return []; }',
							},
						],
					},
				],
			},
			{
				code: '<?php $useByRef = function() use(&$var) {};',
				errors: [
					{
						messageId: 'noAssignRef',
						line: 1,
						column: 34,
						endLine: 1,
						endColumn: 39,
						suggestions: [
							{
								desc: 'Remove the reference operator (&).',
								output: '<?php $useByRef = function() use($var) {};',
							},
						],
					},
				],
			},
		],
	},
);
