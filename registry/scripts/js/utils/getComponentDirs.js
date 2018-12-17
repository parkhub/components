import { filter, map } from '@serverless/utils'
import fs from 'fs-extra'
import { join, resolve } from 'path'
import anyTypeFileExistsAtPath from './anyTypeFileExistsAtPath'

const registryPath = resolve(__dirname, join('..', '..', '..'))

const getComponentDirs = async () => filter(
  anyTypeFileExistsAtPath,
  map(
    (componentDir) => join(registryPath, componentDir),
    fs.readdirSync(registryPath)
  )
)

export default getComponentDirs
