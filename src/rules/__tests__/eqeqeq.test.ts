import { RuleTester } from 'eslint';

import php from '../../index';
import { eqeqeq } from '../eqeqeq';

const ruleTester = new RuleTester({
	plugins: { php },
	language: 'php/php',
});

ruleTester.run('eqeqeq', eqeqeq, {
	valid: ['<?php $a === $b;', '<?php $a !== $b;'],
	invalid: [
		{
			code: '<?php $a == $b;',
			errors: [
				{
					messageId: 'unexpected',
					data: {
						expectedOperator: '===',
						actualOperator: '==',
					},
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: '<?php $a != $b;',
			errors: [
				{
					messageId: 'unexpected',
					data: {
						expectedOperator: '!==',
						actualOperator: '!=',
					},
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
	],
});
