import { type Rule,RuleTester } from 'eslint';

import php from '../../index';
import { requireVisibility, visibilityOptions } from '../require-visibility';

const ruleTester = new RuleTester({
	plugins: {
		php,
	},
	language: 'php/php',
});

// TODO: Fix the types.
ruleTester.run(
	'require-visibility',
	requireVisibility as unknown as Rule.RuleModule,
	{
		valid: [
			'<?php class Foo { public function bar() {} }',
			'<?php class Foo { public static function bar() {} }',
			'<?php class Foo { abstract public static function bar(); }',
			'<?php class Foo { public $a = 1; }',
			'<?php class Foo { public static $a = 1; }',
			'<?php class Foo { private const FOO = 1; }',
			'<?php function foo() {}',
		],
		invalid: [
			{
				name: 'method',
				code: '<?php class Foo { function bar() {} }',
				errors: [
					{
						messageId: 'requireVisibilityForMethod',
						data: {
							name: 'bar',
						},
						line: 1,
						column: 19,
						endLine: 1,
						endColumn: 36,
						suggestions: [
							{
								messageId: 'addVisibility',
								data: { visibility: 'private' },
								output: '<?php class Foo { private function bar() {} }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'protected' },
								output: '<?php class Foo { protected function bar() {} }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'public' },
								output: '<?php class Foo { public function bar() {} }',
							},
						],
					},
				],
			},
			{
				name: 'single class constant',
				code: '<?php class Foo { const BAR = 1; }',
				errors: [
					{
						messageId: 'requireVisibilityForClassConstant',
						line: 1,
						column: 19,
						endLine: 1,
						endColumn: 32,
						suggestions: visibilityOptions.map((visibility) => ({
							messageId: 'addVisibility',
							data: { visibility },
							output: `<?php class Foo { ${visibility} const BAR = 1; }`,
						})),
					},
				],
			},
			{
				name: 'multiple class constants',
				code: `<?php class Foo {
							const
								BAR = 1,
								BAZ = 2;
						}`,
				errors: [
					{
						messageId: 'requireVisibilityForClassConstants',
						line: 2,
						column: 8,
						endLine: 4,
						endColumn: 16,
						suggestions: visibilityOptions.map((visibility) => ({
							messageId: 'addVisibility',
							data: { visibility },
							output: `<?php class Foo {
							${visibility} const
								BAR = 1,
								BAZ = 2;
						}`,
						})),
					},
				],
			},
			{
				name: 'single class property',
				code: '<?php class Foo { $bar = 1; }',
				errors: [
					{
						messageId: 'requireVisibilityForProperty',
						data: {
							name: 'bar',
						},
						line: 1,
						column: 19,
						endLine: 1,
						endColumn: 27,
						suggestions: visibilityOptions.map((visibility) => ({
							messageId: 'addVisibility',
							data: { visibility },
							output: `<?php class Foo { ${visibility} $bar = 1; }`,
						})),
					},
				],
			},
			{
				name: 'multiple class properties',
				code: `<?php class Foo { 
							$bar = 1,
							$baz = 2;
						}`,
				errors: [
					{
						messageId: 'requireVisibilityForProperties',
						data: {
							name: 'bar, baz',
						},
						line: 2,
						column: 8,
						endLine: 3,
						endColumn: 16,
						suggestions: visibilityOptions.map((visibility) => ({
							messageId: 'addVisibility',
							data: { visibility },
							output: `<?php class Foo { 
							${visibility} $bar = 1,
							$baz = 2;
						}`,
						})),
					},
				],
			},
		],
	},
);
