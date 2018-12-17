import { all } from '@serverless/utils'
import BbPromise from 'bluebird'
import cp from 'child_process'
import { join } from 'path'
import getComponentDirs from './getComponentDirs'

const concurrency = 0

const removeNodeModules = async (componentDirPath) =>
  new Promise((resolve, reject) => {
    const command = cp.spawn('rm', ['-rf', join(componentDirPath, 'node_modules')], {
      env: process.env
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const removePackageLock = async (componentDirPath) =>
  new Promise((resolve, reject) => {
    const command = cp.spawn('rm', ['-f', join(componentDirPath, 'package-lock.json')], {
      env: process.env
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const cleanseComponent = async (componentDirPath) =>
  all([
    removeNodeModules(componentDirPath),
    removePackageLock(componentDirPath)
  ])

const cleanseComponents = async () => {
  const componentDirs = await getComponentDirs()
  return BbPromise.map(
    componentDirs,
    cleanseComponent,
    { concurrency }
  )
}

export default cleanseComponents
