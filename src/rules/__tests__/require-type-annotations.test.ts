import { RuleTester } from 'eslint';

import php from '../../index';
import { requireTypeAnnotations } from '../require-type-annotations';

const ruleTester = new RuleTester({
	plugins: { php },
	language: 'php/php',
});

ruleTester.run('require-type-annotations', requireTypeAnnotations, {
	valid: [
		'<?php class Foo { public int $a = 1; }',
		'<?php class Foo { public function bar(): int {} }',
		'<?php class Foo { public function __construct() {} }',
		'<?php class Foo { public function bar( int $param ): int {} }',
		'<?php function foo(): int {}',
		'<?php function foo( int $param ): int {}',
		'<?php array_map(function(): int {}, []);',
		'<?php array_map(function( int $param ): int {}, []);',
		'<?php array_map(fn(): int => 1, []);',
		'<?php array_map(fn( int $param ): int => 1, []);',
	],
	invalid: [
		{
			code: '<?php class Foo { public $bar; }',
			errors: [
				{
					messageId: 'requireTypesForProperty',
					data: { name: 'bar' },
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: '<?php class Foo { public function bar() {} }',
			errors: [
				{
					messageId: 'requireTypesForMethodReturnType',
					data: { name: 'bar' },
					line: 1,
					column: 35,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: '<?php class Foo { public function bar( $param ): int {} }',
			errors: [
				{
					messageId: 'requireTypesForParameter',
					data: { name: 'param' },
					line: 1,
					column: 40,
					endLine: 1,
					endColumn: 46,
				},
			],
		},
		{
			code: '<?php function foo() {}',
			errors: [
				{
					messageId: 'requireTypesForFunctionReturnType',
					data: { name: 'foo' },
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '<?php function foo( $param ): int {}',
			errors: [
				{
					messageId: 'requireTypesForParameter',
					data: { name: 'param' },
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '<?php array_map(function() {}, []);',
			errors: [
				{
					messageId: 'requireTypesForClosureReturnType',
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: '<?php array_map(function( $param ): int {}, []);',
			errors: [
				{
					messageId: 'requireTypesForParameter',
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 33,
				},
			],
		},
		{
			code: '<?php array_map(fn() => 1, []);',
			errors: [
				{
					messageId: 'requireTypesForClosureReturnType',
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '<?php array_map(fn( $param ): int => 1, []);',
			errors: [
				{
					messageId: 'requireTypesForParameter',
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
	],
});
