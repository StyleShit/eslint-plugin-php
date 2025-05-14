import { type Linter } from 'eslint';

export const recommended: Linter.Config = {
	language: 'php/php',
	rules: {
		'php/disallow-references': 'error',
		'php/eqeqeq': 'error',
		'php/no-array-keyword': 'error',
		'php/require-type-annotations': 'error',
		'php/require-visibility': 'error',
	},
};
