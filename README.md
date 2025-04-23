# Create TypeScript Package

A template project for developing & publishing TypeScript packages.

## Configuration

1. Replace the package name, description, author, license, etc. in the [package.json](./package.json) with your package's details

2. Update this [README.md](./README.md) file to contain your package's documentation

3. Update the [release.yml](.github/workflows/release.yml) workflow to check for your username when publishing (this is used to prevent the workflow from running in forks):

   ```yaml
   if: startsWith(github.repository, '{your-username}/')
   ```

4. Configure `GITHUB_TOKEN` to have the permissions to create Pull Requests:

   1. Go to https://github.com/{owner}/{repo}/settings/actions
   2. Check "Allow GitHub Actions to create and approve pull requests" under "Workflow permissions"

5. Add `NPM_TOKEN` to your Repository secrets:

   1. Go to NPM's [Access Tokens](https://www.npmjs.com/settings/styleshit/tokens) page
   2. Click "Generate New Token" -> "Classic Token" and follow the instructions (make sure to choose "Automation" for the token type)
   3. Go to https://github.com/{owner}/{repo}/settings/secrets/actions, and add the generated token as a secret named `NPM_TOKEN`

## Structure

- `src/` - TypeScript source files
- `**/__tests__/` - Test files
- `dist/` - Compiled JavaScript files

## Tools

This template uses [tsup](https://tsup.egoist.dev/) for transpiling & bundling,
[Vitest](https://vitest.dev/) for testing,
[ESLint](https://eslint.org/) & [TypeScript ESLint](https://typescript-eslint.io/) (with the strictest configuration) for linting,
[Prettier](https://prettier.io/) for formatting,
and [Changesets](https://github.com/changesets/changesets) for versioning & publishing.

## Development Flow

1. Add your code & tests to the `src/` directory

2. Use `npm run test` to run the tests

3. Use `npm run lint` to lint the code

4. Use `npm run format` to format the code

5. Use `npm run build` to build the package

6. Run `npx changeset` each time you want to add a commit to the changelog (see [Using Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md#using-changesets) for more info)

7. Commit & push your changes

8. The CI will automatically open a PR with the changes, or add the changes to an existing PR

9. Review & merge the PR when you're ready to publish the package
