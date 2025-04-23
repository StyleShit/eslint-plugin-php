import { defineConfig } from 'tsup';
import packageJson from './package.json';

export default defineConfig({
	entry: ['src/index.ts'],
	clean: true,
	format: ['esm', 'cjs'],
	dts: true,
	env: {
		PACKAGE_NAME: packageJson.name,
		PACKAGE_VERSION: packageJson.version,
	},
});
