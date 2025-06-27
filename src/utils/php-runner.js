import { createNodeFsMountHandler, loadNodeRuntime } from '@php-wasm/node';
import { PHP } from '@php-wasm/universal';

const code = process.argv[2];

if (!code) {
	console.error('Please provide PHP code as an argument.');
	process.exit(1);
}

const php = new PHP(await loadNodeRuntime('7.4'));

php.mkdir('/vendor');
await php.mount('/vendor', createNodeFsMountHandler(process.cwd() + '/vendor'));

const phpScript = `
  <?php
  
  require '/vendor/autoload.php';

  use PhpParser\\ParserFactory;

  $code = '${code}';

  $parser = (new ParserFactory())->createForNewestSupportedVersion();
  try {
      echo json_encode($parser->parse($code));
  } catch (Error $error) {
      exit(1);
  }
`;

const output = await php.runStream({
	code: phpScript,
});

console.log(await output.stdoutText);

process.exit(await output.exitCode);
