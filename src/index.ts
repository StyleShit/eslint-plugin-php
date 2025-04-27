import { ESLint } from 'eslint';
import { PHPLanguage } from './language/php-language';

import { eqeqeq } from './rules/eqeqeq';
import { noArrayKeyword } from './rules/no-array-keyword';
import { noAssignRef } from './rules/no-assign-ref';
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
		eqeqeq,
		'no-array-keyword': noArrayKeyword,
		'no-assign-ref': noAssignRef,
		'require-visibility': requireVisibility,
	},
} satisfies ESLint.Plugin;

export default plugin;
