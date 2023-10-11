# update-action-version-in-file

This action looks for usages of a specified GitHub action so it can update each instance with the latest version. It will return the updated content as an output and it can optionally save the changes to disk.

This action isn't intended to be used as a standalone action.  It should be used within the reusable build workflows for im-open actions.

## Index <!-- omit in toc -->

- [update-action-version-in-file](#update-action-version-in-file)
  - [Inputs](#inputs)
  - [Outputs and Environment Variables](#outputs-and-environment-variables)
    - [Recompiling Manually](#recompiling-manually)
    - [Tests](#tests)

## Inputs

| Parameter         | Is Required | Default | Description                                                                                                                                                                                                                  |
|-------------------|-------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file-to-update`  | true        |         | The name of the file that should be updated with the new action version.                                                                                                                                                     |
| `action-name`     | true        |         | The name of the action that will be updated in the specified file. Format should be `org/repo` and any nested directories if applicable.</br>&nbsp;&nbsp;• `im-open/is-actor-authorized`</br>&nbsp;&nbsp;• `actions/aws/ec2` |
| `version-prefix`  | false       | `v`     | The prefix the action uses in its versions, if applicable.                                                                                                                                                                   |
| `updated-version` | true        |         | The new action version to replace other instances with in the specified file.                                                                                                                                                |

## Outputs and Environment Variables

| Output                    | Description                                                                         |
|---------------------------|-------------------------------------------------------------------------------------|
| `outputs.updated-content` | A copy of the original file content that has been updated with the new version.     |
| `outputs.has-changes`     | Flag indicating whether or not version changes were detected in the specified file. |
| `env.UPDATED_CONTENT`     | A copy of the original file content that has been updated with the new version.     |
| `env.FILE_HAS_CHANGED`    | Flag indicating whether or not version changes were detected in the specified file. |

### Recompiling Manually

If any of the files in this directory are changed, the action should be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Tests

If any files under this action directory are changed, test will run for this action.  These tests should pass before the PR is merged to the default branch.
