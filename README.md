# ESLint Plugin PHP

An ESLint plugin to lint PHP files.

> [!NOTE]  
> This is basically a POC for PHP linter using ESLint's new [Languages API](https://eslint.org/docs/latest/extend/languages).
> It aims to provide a better linting experience than [PHP CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer).

## Installation

```bash
npm i -D eslint-plugin-php
```

## Usage

[Add `php` as a plugin](https://eslint.org/docs/latest/use/configure/plugins#configure-plugins) in your ESLint configuration file,
[specify the `language`](https://eslint.org/docs/latest/use/configure/plugins#specify-a-language) for the files you want to lint,
and [configure the rules](https://eslint.org/docs/latest/use/configure/plugins#use-plugin-rules) you want to use:

```js
// eslint.config.mjs
import php from 'eslint-plugin-php';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.php'],
    plugins: {
      php,
    },
    language: 'php/php',
    rules: {
      'php/eqeqeq': 'error',
      'php/no-array-keyword': 'error',
    },
  },
]);
```

## Available Rules

🔧 - Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/use/command-line-interface#--fix).

💡 - Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Rule ID                   | Description                                         | 🔧  | 💡  |
| ------------------------- | --------------------------------------------------- | --- | --- |
| `php/disallow-references` | Disallow the use of references                      |     | 💡  |
| `php/eqeqeq`              | Require the use of `===` and `!==`                  |     |     |
| `php/no-array-keyword`    | Disallow the use of the array keyword               | 🔧  |     |
| `php/require-visibility`  | Require visibility for class methods and properties |     | 💡  |

## Development

Use `npm run playground` to lint local PHP files under the `playground` directory.
