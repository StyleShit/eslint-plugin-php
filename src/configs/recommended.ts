import { type Linter } from 'eslint';

export const recommended: Linter.Config = {
	language: 'php/php',
	rules: {
		'php/disallow-references': 'error',
		'php/eqeqeq': 'error',
		'php/no-array-keyword': 'error',
		'php/require-types': 'warn',
		'php/require-visibility': 'error',
	},
};
