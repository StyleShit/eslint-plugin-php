import { type Linter } from 'eslint';

export const recommended: Linter.Config = {
	rules: {
		'php/eqeqeq': 'error',
		'php/disallow-references': 'error',
		'php/no-array-keyword': 'error',
		'php/require-visibility': 'error',
	},
};
