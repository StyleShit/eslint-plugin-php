import { RuleTester } from 'eslint';

import php from '../../index';
import { disallowReferences } from '../disallow-references';

const ruleTester = new RuleTester({
	plugins: { php },
	language: 'php/php',
});

ruleTester.run('disallow-references', disallowReferences, {
	valid: [
		'<?php $a = [1, 2, 3]; $my_var = $a;',
		'<?php function myFunc($var) { return []; }',
		'<?php $used = function() use($var) {};',
		'<?php $fn = function () { return $a; };',
		'<?php class A { private function test2($a) {} }',
	],
	invalid: [
		{
			code: '<?php $a = [1, 2, 3]; $my_var = &$a;',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 36,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php $a = [1, 2, 3]; $my_var = $a;',
						},
					],
				},
			],
		},
		{
			code: '<?php function myFunc(&$var) { return []; }',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 28,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php function myFunc($var) { return []; }',
						},
					],
				},
			],
		},
		{
			code: '<?php function &myFunc($var) { return []; }',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php function myFunc($var) { return []; }',
						},
					],
				},
			],
		},
		{
			code: '<?php $used = function() use(&$var) {};',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 35,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php $used = function() use($var) {};',
						},
					],
				},
			],
		},
		{
			code: '<?php $fn = function &() { return $a; };',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 40,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php $fn = function () { return $a; };',
						},
					],
				},
			],
		},
		{
			code: '<?php class A { private function &test2($a) {} }',
			errors: [
				{
					messageId: 'disallowReferences',
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 40,
					suggestions: [
						{
							messageId: 'removeAmp',
							output: '<?php class A { private function test2($a) {} }',
						},
					],
				},
			],
		},
	],
});
