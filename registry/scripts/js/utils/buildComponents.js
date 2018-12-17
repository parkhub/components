import BbPromise from 'bluebird'
import cp from 'child_process'
import os from 'os'
import { join } from 'path'
import getComponentDirs from './getComponentDirs'

let babel = join(__dirname, '..', '..', '..', 'node_modules', '.bin')
babel = os.platform().startsWith('win') ? join(babel, 'babel.cmd') : join(babel, 'babel')

const buildComponent = async (componentDirPath, watch) =>
  new BbPromise((resolve, reject) => {
    const params = [
      join(componentDirPath, 'src'),
      '--out-dir',
      join(componentDirPath, 'dist'),
      '--source-maps',
      '--copy-files',
      '--ignore',
      '**/node_modules',
      '--ignore',
      '**/*.test.js'
    ]

    if (watch === true) {
      params.unshift('--watch')
    }

    const command = cp.spawn(babel, params, { env: process.env, cwd: process.cwd() })
    command.stdout.on('data', (data) => {
      console.log(data.toString().replace(/\n/, ''))
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const buildComponents = async (watch, concurrency) => {
  const componentDirs = await getComponentDirs()
  return BbPromise.map(
    componentDirs,
    async (componentDirPath) => buildComponent(componentDirPath, watch),
    { concurrency }
  )
}

export default buildComponents
