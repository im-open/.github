# Summary of PR changes



## PR Requirements
- [ ] For major, minor, or breaking changes, at least one of the commit messages contains the appropriate `+semver:` keywords.
  - See the *Incrementing the Version* section of the repository's README.md for more details.
- [ ] The action code does not contain sensitive information.
- [ ] The examples in the repository's `README.md` have been updated with the new version.  
  - This should happen automatically as part of the build.  See the *Incrementing the Version* section of the repository's README.md for more details on how the version will be incremented if it did not.
- [ ] For JavaScript actions, the action has been recompiled.  
  - This should happen automatically as part of the build.  See the *Recompiling Manually* section of the repository's README.md for more details if it did not.
  - This does not apply to Composite Run Steps actions unless a package.json is present and contains a build script.
