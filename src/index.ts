import { ESLint } from 'eslint';
import { PHPLanguage } from './language/php-language';

import { eqeqeq } from './rules/eqeqeq';
import { noArrayKeyword } from './rules/no-array-keyword';
import { disallowReferences } from './rules/disallow-references';
import { requireVisibility } from './rules/require-visibility';

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
