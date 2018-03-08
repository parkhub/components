const BbPromise = require('bluebird')
const utils = require('./utils')

const {
  errorReporter,
  getComponents,
  buildGraph,
  executeGraph,
  readStateFile,
  writeStateFile
} = utils

const run = async (command, options) => {
  const reporter = await errorReporter()
  let components = {}
  let stateFile = {}
  try {
    stateFile = await readStateFile()
    components = await getComponents(stateFile)
    const graph = await buildGraph(components)
    await executeGraph(graph, components, stateFile, command, options)
  } catch (error) {
    reporter.captureException(error)
    return BbPromise.reject(error)
  } finally {
    await writeStateFile(stateFile)
    return components // eslint-disable-line no-unsafe-finally
  }
}

module.exports = {
  ...utils,
  run
}
