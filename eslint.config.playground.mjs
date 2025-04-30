/* eslint-disable no-console */
import fs from 'fs';
import { defineConfig } from 'eslint/config';

if (!fs.existsSync('./dist/index.js')) {
	console.error('Please run `npm run build` before using the playground.');

	process.exit(1);
}

const phpFiles = fs
	.readdirSync('./playground')
	.filter((file) => file.endsWith('.php'));

if (phpFiles.length === 0) {
	console.error(
		'Please add PHP files to `/playground` before using the playground.',
	);

	process.exit(1);
}

const php = (await import('./dist/index.js')).default;

export default defineConfig({
	files: ['./**/*.php'],
	plugins: {
		php,
	},
	language: 'php/php',
	rules: {
		// TODO: Use recommended config.
		'php/eqeqeq': 'error',
		'php/disallow-references': 'error',
		'php/no-array-keyword': 'error',
		'php/require-visibility': 'error',
	},
});
