// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';

let osPlat: string = os.platform();
let osArch: string = os.arch();

if (!tempDirectory) {
  let baseLocation;
  if (process.platform === 'win32') {
    core.setFailed('not support windows platform')
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getDockerize(version: string) {
  // check cache
  let toolPath: string;
  toolPath = tc.find('dockerize', normalizeVersion(version));

  if (!toolPath) {
    // download, extract, cache
    toolPath = await acquire(version);
    core.debug('Go tool is cached under ' + toolPath);
  }

  toolPath = path.join(toolPath);
  //
  // prepend the tools path. instructs the agent to prepend for future tasks
  //
  core.addPath(toolPath);
}

async function acquire(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //
  let downloadUrl: string = getDownloadUrl(version);
  let downloadPath: string | null = null;
  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (error) {
    core.debug(error);

    throw `Failed to download version ${version}: ${error}`;
  }

  //
  // Extract
  //
  let extPath: string = tempDirectory;
  if (!extPath) {
    throw new Error('Temp directory not set');
  }

  extPath = await tc.extractTar(downloadPath);
  //
  // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
  //
  version = normalizeVersion(version);
  return await tc.cacheDir(extPath, 'dockerize', version);
}

function getDownloadUrl(version: string): string {
  const platform: string = osPlat;
  const arch: string = osArch == 'x64' ? 'amd64' : '386';
  const filename: string = `dockerize-${platform}-${arch}-v${version}.tar.gz`;
  return `https://github.com/jwilder/dockerize/releases/download/v${version}/${filename}`;
}

// This function is required to convert the version 1.10 to 1.10.0.
// Because caching utility accept only sementic version,
// which have patch number as well.
function normalizeVersion(version: string): string {
  const versionPart = version.split('.');
  if (versionPart[1] == null) {
    //append minor and patch version if not available
    return version.concat('.0.0');
  } else if (versionPart[2] == null) {
    //append patch version if not available
    return version.concat('.0');
  }
  return version;
}