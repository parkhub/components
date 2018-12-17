import BbPromise from 'bluebird'
import cp from 'child_process'
import os from 'os'
import getComponentDirs from './getComponentDirs'

const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'
const concurrency = 3


const installComponent = async (componentDirPath) =>
  new Promise((resolve, reject) => {
    const command = cp.spawn(npmCmd, ['install'], { env: process.env, cwd: componentDirPath })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const installComponents = async () => {
  const componentDirs = await getComponentDirs()
  return BbPromise.map(
    componentDirs,
    installComponent,
    { concurrency }
  )
}

export default installComponents
