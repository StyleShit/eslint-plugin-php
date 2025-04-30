import { type ESLint } from 'eslint';

import { disallowReferences } from './rules/disallow-references';
import { eqeqeq } from './rules/eqeqeq';
import { noArrayKeyword } from './rules/no-array-keyword';
import { requireVisibility } from './rules/require-visibility';

import { PHPLanguage } from './language/php-language';

const plugin = {
	meta: {
		name: process.env.PACKAGE_NAME,
		version: process.env.PACKAGE_VERSION,
	},
	languages: {
		php: new PHPLanguage(),
	},
	rules: {
		'disallow-references': disallowReferences,
		eqeqeq,
		'no-array-keyword': noArrayKeyword,
		'require-visibility': requireVisibility,
	},
} satisfies ESLint.Plugin;

export default plugin;
