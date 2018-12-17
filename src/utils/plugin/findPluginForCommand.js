import { find } from '@serverless/utils'

const findPluginForCommand = (command, context) =>
  find((plugin) => {
    console.log('command:', command, ' plugin.command:', plugin.command)
    return plugin.command === command
  }, context.plugins)

export default findPluginForCommand
