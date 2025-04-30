# Contributing

Thank you for your interest in contributing! Whether it's a bug report, feature request, or a pull request, we appreciate your help in improving this ESLint plugin.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Linting, Formatting, and Testing](#linting-formatting-and-testing)
- [Playground](#playground)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Resources](#resources)

## Code of Conduct

We adhere to the [OpenJS Foundation Code of Conduct](https://github.com/openjs-foundation/cross-project-council/blob/main/CODE_OF_CONDUCT.md). Please be respectful, inclusive, and constructive in all your communications and contributions.

If you're new to open source, this guide might also be helpful:
[How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

## Getting Started

To contribute, **fork the repository**, then clone your fork and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/eslint-plugin-php.git
cd eslint-plugin-php
npm install
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

## Development Workflow

1. **Create a new branch** for each feature or fix:

   ```bash
   git checkout -b fix/rule-name-or-feature
   ```

2. **Make changes** to the codebase:

   - Rules live in `src/rules/`
   - Tests go in `src/rules/__tests__/`
   - Add it to the `recommended` config (under `src/configs/recommended.ts`)

3. **Document your rule:**

   - Update the rules list in `README.md`

## Linting, Formatting, and Testing

Run the following before committing:

```bash
npm run lint       # Check for linting issues
npm run format     # Format code with Prettier
npm run test           # Run all tests
```

To run tests for a specific rule:

```bash
npm run test rule-name
```

> Replace `rule-name` with the file name of your rule.

## Playground

If you want to test how the rules work on PHP code, you can use the **playground** directory. This allows you to quickly run the plugin on sample PHP files.

1. Place your PHP code in the `/playground` directory.
2. Run the following command to lint the files using the local project rules:

```bash
npm run playground
```

This will lint all the PHP files in the `/playground` directory with the plugin's current rules.

Don't forget to build your code before running the playground, to ensure all changes are included in the linting process:

```bash
npm run build
```

You can also use `npm run build -- --watch` to automatically rebuild your code when you make changes.

## Submitting Issues

If you find a bug or want to request a feature, please open an issue and include:

- A clear description of the problem
- Code snippets or test cases
- ESLint and `eslint-plugin-php` versions

## Submitting Pull Requests

1. Push your changes to your fork.
2. Open a pull request to the `main` branch of the original repository.
3. Include:
   - Tests for your rule or fix
   - Updates to the rule list in the README (if applicable)
   - Entry in the recommended config (if applicable)
4. Make sure all lint, format, and test checks pass.

We’ll review your PR as soon as possible. Thank you for contributing to `eslint-plugin-php`!

## Resources

- **Creating custom ESLint rules**:  
  https://eslint.org/docs/latest/extend/custom-rules

- **Explore the PHP AST**:  
  Use [AST Explorer](https://astexplorer.net/) with the **PHP** language selected to view and understand abstract syntax trees. This is very helpful for rule development.
