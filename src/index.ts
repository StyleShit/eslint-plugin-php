import { ESLint } from 'eslint';
import { PHPLanguage } from './language/php-language';

const plugin = {
	meta: {
		name: 'eslint-plugin-php',
		version: '0.0.0',
	},
	languages: {
		php: new PHPLanguage(),
	},
} satisfies ESLint.Plugin;

export const meta = plugin.meta;
export const languages = plugin.languages;
