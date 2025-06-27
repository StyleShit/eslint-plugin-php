import { RuleTester } from 'eslint';

import php from '../../index';
import { noFinal } from '../no-final';

const ruleTester = new RuleTester({
	plugins: { php },
	language: 'php/php',
});

ruleTester.run('no-final', noFinal, {
	valid: [
		{
			name: 'methods',
			code: `
			<?php
				class Test {
					public function method1() {}
					protected function method2() {}
					private function method3() {}
				}
			`,
		},

		{
			name: 'properties',
			code: `
			<?php
				class Test {
					public $property1;
					protected $property2;
					private $property3;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'final class',
			code: '<?php final class Test {}',
			errors: [
				{
					messageId: 'noFinal',
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 23,
				},
			],
		},

		{
			name: 'final class constant',
			code: `
			<?php 
				class Test {
					final const CONSTANT = 'value';	
				}
			`,
			errors: [
				{
					messageId: 'noFinal',
					line: 4,
					column: 6,
					endLine: 4,
					endColumn: 36,
					suggestions: [
						{
							messageId: 'removeFinal',
							output: `
			<?php 
				class Test {
					 const CONSTANT = 'value';	
				}
			`,
						},
					],
				},
			],
		},

		{
			name: 'final class property',
			code: `
			<?php 
				class Test {
					final public $property = 'value',
						$property2 = 'value-1';
				}
			`,
			errors: [
				{
					messageId: 'noFinal',
					line: 4,
					column: 6,
					endLine: 5,
					endColumn: 29,
					suggestions: [
						{
							messageId: 'removeFinal',
							output: `
			<?php 
				class Test {
					 public $property = 'value',
						$property2 = 'value-1';
				}
			`,
						},
					],
				},
			],
		},

		{
			name: 'final class method',
			code: `
			<?php 
				class Test {
					final public function method() {
						// Code
					}
				}
			`,
			errors: [
				{
					messageId: 'noFinal',
					line: 4,
					column: 28,
					endLine: 4,
					endColumn: 34,
				},
			],
		},
	],
});
