# Contributing

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## Development Workflow

This plugin provides a local development instance of Strapi to develop it's features. We call this instance `playground` and it can be found in the playground folder in the root of the project. For that reason it is not needed to have your own Strapi instance running to work on this plugin. Just clone the repo and you're ready to go!

#### 1. Fork the [repository](https://github.com/boazpoolman/strapi-plugin-sitemap)

[Go to the repository](https://github.com/boazpoolman/strapi-plugin-sitemap) and fork it to your own GitHub account.

#### 2. Clone from your repository into the plugins folder

```bash
git clone git@github.com:YOUR_USERNAME/strapi-plugin-sitemap.git
```

#### 3. Install the dependencies

Go to the plugin and install it's dependencies.

```bash
cd strapi-plugin-sitemap && yarn install
```

#### 4. Install the dependencies of the playground instance

Run the following command

```bash
yarn playground:install
```

#### 5. Run the typescript compiler of the plugin 

As the plugin is written using Typescript you will have to run the typescript compiler during development. Run the following command:

```bash
yarn develop
```

#### 6. Start the playground instance

Leave the typescript compiler running, open up a new terminal window and browse back to the root of the plugin repo. Run the following command:

```bash
yarn playground:develop
```

This will start the playground instance that will have the plugin installed by default. Browse to http://localhost:1337 and create a test admin user to log in to the playground.

#### 7. Start your contribution!

You can now start working on your contribution. With the typescript compiler on every change to the plugin should lead to a reload of the Strapi instance in which you can then test your change. If you had trouble setting up this testing environment please feel free to report an issue on Github.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, eg add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

### Linting and tests

[ESLint](https://eslint.org/)

We use [ESLint](https://eslint.org/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn eslint`: lint files with ESLint.
- `yarn eslint:fix`: auto-fix ESLint issues.
- `yarn test:unit`: run unit tests with Jest.
- `yarn test:integration`: run integration tests with Jest.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
