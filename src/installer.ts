import { Installer } from '@zcong/actions-installer'
import * as core from '@actions/core'

export class DockerizeInstaller extends Installer {
  constructor() {
    super('dockerize')
  }

  setupDir() {
    if (process.platform === 'win32') {
      core.setFailed('not support windows platform')
    }
    super.setupDir()
  }

  getDownloadUrlByVersion(version: string): string {
    const platform: string = this.osPlat
    const arch: string = this.osArch == 'x64' ? 'amd64' : '386'
    const filename: string = `dockerize-${platform}-${arch}-v${version}.tar.gz`
    return `https://github.com/jwilder/dockerize/releases/download/v${version}/${filename}`
  }
}
