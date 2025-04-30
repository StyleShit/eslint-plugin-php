import eslintPlugin from 'eslint-plugin-eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,

	// eslint-disable-next-line -- It has no types.
	eslintPlugin.configs['flat/recommended'],

	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
	},

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: [
			'**/coverage/**',
			'**/dist/**',
			'**/node_modules/**',
			'**/__snapshots__/**',
		],
	},
	{
		rules: {
			'no-console': 'error',

			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					fixStyle: 'inline-type-imports',
				},
			],

			'simple-import-sort/imports': [
				'error',
				{
					groups: getImportSortGroups(),
				},
			],
		},
	},
);

function getImportSortGroups() {
	// Customized defaults from `eslint-plugin-simple-import-sort`:
	// https://github.com/lydell/eslint-plugin-simple-import-sort/blob/66d84f742/src/imports.js#L5-L19
	return [
		// Side effect imports.
		['^\\u0000'],

		// Node.js builtins prefixed with `node:`.
		['^node:'],

		[
			// Packages that don't start with @ ('fs', 'path', etc.)
			'^\\w',

			// Packages with path imports.
			'^@?\\w+\\/\\w',

			// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
			'^@?\\w',
		],

		// Absolute imports and other imports such as Vue-style `@/foo`.
		// Anything not matched in another group.
		['^'],

		// Rules imports.
		['\\/rules\\/'],

		// Relative imports.
		// Anything that starts with a dot.
		['^\\.'],
	];
}
