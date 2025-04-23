import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPlugin from 'eslint-plugin-eslint-plugin';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,

	// eslint-disable-next-line -- It has no types.
	eslintPlugin.configs['flat/recommended'],

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
		},
	},
);
