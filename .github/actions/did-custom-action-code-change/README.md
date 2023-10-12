# did-custom-action-code-change

This action outputs a flag indicating whether the changes in the PR were to code files and code folders so the build workflow knows whether the action version should be incremented or not. It does this by gathering the list of files and folders changed in a PR through the GH API. The action then compares that list against the list of `files-with-code` and `folders-with-code` to determine if any of those source code items were changed.

This action isn't intended to be used as a standalone action.  It should be used within the reusable build workflows for im-open actions.

## Index <!-- omit in toc -->

- [did-custom-action-code-change](#did-custom-action-code-change)
  - [Inputs](#inputs)
  - [Outputs and Environment Variables](#outputs-and-environment-variables)
    - [Recompiling Manually](#recompiling-manually)
    - [Tests](#tests)

## Inputs

| Parameter           | Is Required | Default | Description                                                       |
|---------------------|-------------|---------|-------------------------------------------------------------------|
| `files-with-code`   | false       | N/A     | A comma separated list of code files to check for changes.        |
| `folders-with-code` | false       | N/A     | A comma separated list of folders with code to check for changes. |
| `token`             | true        | N/A     | A token with permission to retrieve PR information.               |

## Outputs and Environment Variables

| Output                 | Description                                                                   |
|------------------------|-------------------------------------------------------------------------------|
| `outputs.HAS_CHANGES`  | Flag indicating whether changes were found in the code files or code folders. |
| `env.CODE_HAS_CHANGED` | Flag indicating whether changes were found in the code files or code folders. |

### Recompiling Manually

If any of the files in this directory are changed, the action should be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Tests

If any files under this action directory are changed, test will run for this action.  These tests should pass before the PR is merged to the default branch.
