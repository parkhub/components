const EventGateway = require('@serverless/event-gateway-sdk')

// "private" functions
function getEventGatewayInstance(params) {
  const { space } = params
  let { eventGatewayApiKey } = params
  if (process.env.EVENT_GATEWAY_API_KEY) {
    eventGatewayApiKey = process.env.EVENT_GATEWAY_API_KEY // eslint-disable-line no-param-reassign
  }

  return new EventGateway({
    url: 'https://eventgateway-dev.io',
    configurationUrl: 'https://config.eventgateway-dev.io',
    apikey: eventGatewayApiKey,
    space
  })
}

function getCredentials() {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN } = process.env
  let credentials = {
    awsAccessKeyId: AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: AWS_SECRET_ACCESS_KEY
  }
  if (AWS_SESSION_TOKEN) {
    credentials = {
      ...credentials,
      awsSessionToken: AWS_SESSION_TOKEN
    }
  }
  return credentials
}

function getFunctionId(params) {
  const { lambdaArn } = params
  const matchRes = lambdaArn.match(new RegExp('(.+):(.+):(.+):(.+):(.+):(.+):(.+)'))
  return matchRes ? matchRes[7] : ''
}

function getRegion(params) {
  const { lambdaArn } = params
  const matchRes = lambdaArn.match(new RegExp('(.+):(.+):(.+):(.+):(.+):(.+):(.+)'))
  return matchRes ? matchRes[4] : ''
}

async function registerFunction(params) {
  const {
    egInstance, functionId, lambdaArn, region
  } = params
  const credentials = getCredentials()
  return egInstance.registerFunction({
    functionId,
    provider: {
      type: 'awslambda',
      arn: lambdaArn,
      region,
      ...credentials
    }
  })
}

async function deleteFunction(params) {
  const { egInstance, functionId } = params
  return egInstance.deleteFunction({ functionId })
}

async function subscribe(params) {
  const {
    egInstance, functionId, event, path, method, cors, space
  } = params

  // TODO: remove mutation
  // eslint-disable-next-line no-param-reassign
  params = {
    functionId,
    event,
    path: `/${space}/${path}`
  }
  if (path && method) {
    // eslint-disable-next-line no-param-reassign
    params = {
      ...params,
      method
    }
  }
  if (cors) {
    // eslint-disable-next-line no-param-reassign
    params = {
      ...params,
      cors: {}
    }
  }
  return egInstance.subscribe(params)
}

async function unsubscribe(params) {
  const { egInstance, subscriptionId } = params
  return egInstance.unsubscribe({ subscriptionId })
}

async function listSubscriptions(params) {
  const { egInstance } = params
  return egInstance.listSubscriptions()
}

async function create(params) {
  const {
    egInstance, functionId, lambdaArn, event, path, method, cors, space, region
  } = params
  await registerFunction({
    egInstance,
    functionId,
    lambdaArn,
    region
  })
  const res = await subscribe({
    egInstance,
    functionId,
    event,
    path,
    method,
    cors,
    space
  })
  return {
    subscriptionId: res.subscriptionId,
    url: event === 'http' ? `https://${space}.eventgateway-dev.io/${path}` : null
  }
}

async function update(params) {
  const {
    egInstance, functionId, event, path, method, cors, space, subscriptionId
  } = params
  await unsubscribe({ egInstance, subscriptionId })
  const res = await subscribe({
    egInstance,
    functionId,
    event,
    path,
    method,
    cors,
    space
  })
  return {
    subscriptionId: res.subscriptionId,
    url: event === 'http' ? `https://${space}.eventgateway-dev.io/${path}` : null
  }
}

// "public" functions
async function deploy(inputs, options, state, context) {
  const region = getRegion(inputs)
  const functionId = getFunctionId(inputs)
  const egInstance = getEventGatewayInstance(inputs)

  // eslint-disable-next-line no-param-reassign
  inputs = {
    ...inputs,
    functionId,
    region,
    egInstance
  }

  const shouldCreate = !state.lambdaArn || !state.subscriptionId
  const shouldUpdate =
    state.event !== inputs.event ||
    state.path !== inputs.path ||
    state.method !== inputs.method ||
    state.cors !== inputs.cors

  let outputs = state
  if (shouldCreate) {
    context.log(`Creating Event Gateway Subscription: "${functionId}"`)
    outputs = await create(inputs)
  } else if (shouldUpdate) {
    context.log(`Updating Event Gateway Subscription: "${functionId}"`)
    outputs = await update({
      ...state,
      ...inputs
    })
  }
  return outputs
}

async function remove(inputs, options, state, context) {
  const region = getRegion(inputs)
  const functionId = getFunctionId(inputs)
  const egInstance = getEventGatewayInstance(inputs)

  // eslint-disable-next-line no-param-reassign
  inputs = {
    ...inputs,
    functionId,
    region,
    egInstance
  }

  const shouldRemove = state.subscriptionId

  let outputs = state
  if (shouldRemove) {
    context.log(`Removing Event Gateway Subscription: "${functionId}"`)
    await unsubscribe({ egInstance, subscriptionId: state.subscriptionId })
    await deleteFunction({ egInstance, functionId })
    outputs = {
      subscriptionId: null,
      url: null
    }
  }
  return outputs
}

async function info(inputs, options, state, context) {
  const egInstance = getEventGatewayInstance(inputs)

  context.log('Event Gateway setup:')
  if (Object.keys(state).length) {
    let res = await listSubscriptions({ egInstance })
    if (res.length) {
      // filter out the result we're looking for
      res = res
        .filter((entry) => {
          const pathWithoutSpace = entry.path.replace(`/${inputs.space}/`, '')
          const functionName = inputs.lambdaArn.split(':').pop()
          return (
            inputs.event === entry.event &&
            inputs.path === pathWithoutSpace &&
            functionName === entry.functionId
          )
        })
        .shift()
      // enhance the result with some information from the state
      const setup = {
        ...res,
        url: state.url
      }
      context.log(JSON.stringify(setup, null, 2))
    } else {
      context.log('Something went wrong...')
    }
  } else {
    context.log('Not deployed yet...')
  }
}

module.exports = {
  deploy,
  remove,
  info
}