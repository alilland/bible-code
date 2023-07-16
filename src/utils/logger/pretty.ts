import debug from 'debug'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pretty (namespace: string, level: string, message: string, obj?: any): void {
  const logger = debug(`app:${namespace}`)
  const msg = `${level} ${message}`
  if (obj != null) {
    logger(msg, obj)
  } else {
    logger(msg)
  }
}

export default pretty
