
import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    const version = core.getInput('dockerize-version')
    if (version) {
      await installer.getDockerize(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();