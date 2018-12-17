import path from 'path'
import { writeFile } from '@serverless/utils'

const trackingConfigFilePath = path.join(process.cwd(), 'tracking-config.json')

const { SENTRY_DSN, SEGMENT_WRITE_KEY } = process.env

if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN env var not set')
}
if (!SEGMENT_WRITE_KEY) {
  throw new Error('SEGMENT_WRITE_KEY env var not set')
}

const trackingConfig = {
  sentryDSN: SENTRY_DSN,
  environment: 'production',
  segmentWriteKey: SEGMENT_WRITE_KEY
}

const exec = async () => writeFile(trackingConfigFilePath, trackingConfig)

exec()
