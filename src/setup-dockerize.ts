import * as core from '@actions/core'
import { DockerizeInstaller } from './installer'

const instance = new DockerizeInstaller()

async function run() {
  try {
    const version = core.getInput('dockerize-version')
    if (version) {
      await instance.getTools(version)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
