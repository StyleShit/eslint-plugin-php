import { ESLint } from 'eslint';
import { PHPLanguage } from './language/php-language';

import { eqeqeq } from './rules/eqeqeq';
import { noArrayKeyword } from './rules/no-array-keyword';

const plugin = {
	meta: {
		name: 'eslint-plugin-php',
		version: '0.0.0',
	},
	languages: {
		php: new PHPLanguage(),
	},
	rules: {
		eqeqeq,
		'no-array-keyword': noArrayKeyword,
	},
} satisfies ESLint.Plugin;

export const meta = plugin.meta;
export const languages = plugin.languages;
export const rules = plugin.rules;
