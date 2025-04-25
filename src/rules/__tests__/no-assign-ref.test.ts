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
ruleTester.run(
	'no-assign-ref',
	noAssignRef as unknown as Rule.RuleModule,
	{
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
                name: 'with & in string',
                code: '<?php $a = ["me", "me & you", "you"]; $my_var = &$a;',
                errors: [
                    {
                        messageId: 'noAssignRef',
                        line: 1,
                        column: 39,
                        endLine: 1,
                        endColumn: 53,
                    },
                ],
                output: '<?php $a = ["me", "me & you", "you"]; $my_var = $a;',
            }
		],
	},
);
