import { spawnSync } from 'node:child_process';
import path from 'node:path';

export function parse(code: string) {
	const runner = path.join(import.meta.dirname, 'php-runner.js');

	const { stdout, stderr, status, error } = spawnSync(
		process.execPath,
		[runner, code],
		{ encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 },
	);

	if (status !== 0 || error) {
		throw new Error(stderr || error?.message || `exit ${String(status)}`);
	}

	return JSON.parse(stdout);
}

// const ast = parsePhpSync('<?php echo json_encode(["hello" => "world"]);');

// console.log(JSON.stringify(ast, null, 2));
