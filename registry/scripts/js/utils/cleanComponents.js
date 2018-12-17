import BbPromise from 'bluebird'
import cp from 'child_process'
import { join } from 'path'
import getComponentDirs from './getComponentDirs'

const concurrency = 0

const cleanComponent = async (componentDirPath) =>
  new Promise((resolve, reject) => {
    const command = cp.spawn('rm', ['-rf', join(componentDirPath, 'dist')], {
      env: process.env
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const cleanComponents = async () => {
  const componentDirs = await getComponentDirs()
  return BbPromise.map(
    componentDirs,
    cleanComponent,
    { concurrency }
  )
}

export default cleanComponents
