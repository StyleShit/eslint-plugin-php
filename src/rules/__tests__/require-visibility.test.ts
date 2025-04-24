import { RuleTester, type Rule } from 'eslint';
import php from '../../index';
import { requireVisibility } from '../require-visibility';

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
			'<?php class Foo { static public $a = 1; }',
			'<?php class Foo { private const FOO = 1; }',
		],
		invalid: [
			{
				code: '<?php class Foo { function bar() {} }',
				errors: [
					{
						messageId: 'requireVisibilityForMethod',
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
				code: '<?php class Foo { const BAR = 1; }',
				errors: [
					{
						messageId: 'requireVisibilityForClassConstant',
						line: 1,
						column: 25,
						endLine: 1,
						endColumn: 32,
						suggestions: [
							{
								messageId: 'addVisibility',
								data: { visibility: 'private' },
								output: '<?php class Foo { private const BAR = 1; }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'protected' },
								output: '<?php class Foo { protected const BAR = 1; }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'public' },
								output: '<?php class Foo { public const BAR = 1; }',
							},
						],
					},
				],
			},
			{
				code: '<?php class Foo { var $bar = 1; }',
				errors: [
					{
						messageId: 'requireVisibilityForProperty',
						line: 1,
						column: 23,
						endLine: 1,
						endColumn: 25,
						suggestions: [
							{
								messageId: 'addVisibility',
								data: { visibility: 'private' },
								output: '<?php class Foo { private $bar = 1; }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'protected' },
								output: '<?php class Foo { protected $bar = 1; }',
							},
							{
								messageId: 'addVisibility',
								data: { visibility: 'public' },
								output: '<?php class Foo { public $bar = 1; }',
							},
						],
					},
				],
			},
		],
	},
);
