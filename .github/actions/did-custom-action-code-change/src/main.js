const core = require('@actions/core');
const github = require('@actions/github');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const fileInput = core.getInput('files-with-code') || '';
const filesToCheckForChanges = fileInput && fileInput.length > 0 ? fileInput.split(',') : null;

const folderInput = core.getInput('folders-with-code') || '';
const foldersToCheckForChanges = folderInput && folderInput.length > 0 ? folderInput.split(',') : null;

const prNumber = core.getInput('pr-number') || github.context.issue.number;
const org = core.getInput('org') || github.context.repo.owner;
const repo = core.getInput('repo') || github.context.repo.repo;

const token = core.getInput('token', requiredArgOptions);
const octokit = github.getOctokit(token);

function getPrFolders(prFiles) {
  const prFoldersSet = new Set();

  if (prFiles) {
    prFiles.forEach(f => {
      const folder = f.substring(0, f.lastIndexOf('/'));
      prFoldersSet.add(folder); // Adds the whole folder directory minus the file.ext

      let baseFolder = '';
      folder.split('/').forEach((fp, index) => {
        prFoldersSet.add(fp);

        baseFolder = index === 0 ? fp : `${baseFolder}/${fp}`;
        prFoldersSet.add(baseFolder);
      });
    });
  }

  const prFolders = Array.from(prFoldersSet).sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
  if (prFolders.length > 0) {
    core.info(`\nThe following folders have changes in the PR:\n\t${prFolders.join('\n\t')}`);
  } else {
    core.info(`\nNo folders had changes in the PR.`);
  }

  return prFolders;
}

async function getPRFiles(org, repo, prNumber) {
  const prFilesSet = new Set();
  await octokit
    .paginate(octokit.rest.pulls.listFiles, {
      owner: org,
      repo: repo,
      pull_number: prNumber
    })
    .then(prFileResponse => {
      const prFiles = prFileResponse.map(prf => prf.filename).sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
      prFiles.forEach(f => {
        const fileParts = f.split('/');
        prFilesSet.add(fileParts[fileParts.length - 1]); // Just the file.ext
        prFilesSet.add(f); // The whole file path
      });
    })
    .catch(error => {
      core.error(`\nAn error occurred retrieving the PR files: ${error.message}`);
    });

  const filesToReturn = Array.from(prFilesSet).sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
  core.info(`\nThe following files have changes in the PR:\n\t${filesToReturn.join('\n\t')}`);
  return filesToReturn;
}

async function run() {
  const eventName = github.context.eventName;
  if (eventName !== 'pull_request' && eventName !== 'pull_request_target') {
    core.setFailed('The workflow must have a pull_request or pull_request_target trigger.');
    return;
  }

  core.info(`org: ${org}`);
  core.info(`repo: ${repo}`);
  core.info(`prNumber: ${prNumber}`);

  const filesChangedInPr = await getPRFiles(org, repo, prNumber);
  const foldersChangedInPr = getPrFolders(filesChangedInPr);

  let hasMatchingChanges = false;
  let matchingFiles = [];
  let matchingFolders = [];

  if (filesToCheckForChanges && filesToCheckForChanges.length > 0) {
    matchingFiles = filesToCheckForChanges.filter(f => filesChangedInPr.includes(f)) || [];
    if (matchingFiles.length > 0) {
      hasMatchingChanges = true;
      const joinedFiles = `\n\t${matchingFiles.join('\n\t')}`;
      core.info(`\nThe following files have changes in the PR and match the files to check for changes:${joinedFiles}`);
    }
  }

  if (foldersToCheckForChanges && foldersToCheckForChanges.length > 0) {
    matchingFolders = foldersToCheckForChanges.filter(f => foldersChangedInPr.includes(f)) || [];
    if (matchingFolders.length > 0) {
      hasMatchingChanges = true;
      const joinedFolders = `\n\t${matchingFolders.join('\n\t')}`;
      core.info(
        `\nThe following folders have changes in the PR and match the folders to check for changes:${joinedFolders}`
      );
    }
  }

  core.setOutput('HAS_CHANGES', hasMatchingChanges);
  core.exportVariable('CODE_HAS_CHANGED', hasMatchingChanges);
}

run();
