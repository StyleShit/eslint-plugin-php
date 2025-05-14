import './types';

import { type ESLint } from 'eslint';

import { disallowReferences } from './rules/disallow-references';
import { eqeqeq } from './rules/eqeqeq';
import { noArrayKeyword } from './rules/no-array-keyword';
import { requireTypeAnnotations } from './rules/require-type-annotations';
import { requireVisibility } from './rules/require-visibility';

import { recommended } from './configs/recommended';
import { PHPLanguage } from './language/php-language';

const plugin = {
	meta: {
		name: process.env.PACKAGE_NAME,
		version: process.env.PACKAGE_VERSION,
	},
	languages: {
		php: new PHPLanguage(),
	},
	configs: {
		recommended,
	},
	rules: {
		'disallow-references': disallowReferences,
		eqeqeq,
		'no-array-keyword': noArrayKeyword,
		'require-type-annotations': requireTypeAnnotations,
		'require-visibility': requireVisibility,
	},
} satisfies ESLint.Plugin;

// The configs require circular references to the plugin, which can't be done in the config definition.
Object.values(plugin.configs).forEach((config) => {
	config.plugins ??= {};

	config.plugins.php = plugin;
});

export default plugin;
