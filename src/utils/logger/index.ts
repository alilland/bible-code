/* eslint-disable @typescript-eslint/no-explicit-any */
import pretty from './pretty'
import fileLogger from './fileLogger'

interface ILogger {
  debug: (message: string, obj?: any) => void
  info: (message: string, obj?: any) => void
  warn: (message: string, obj?: any) => void
  error: (message: string, obj?: any) => void
}

const logger = (namespace: string): ILogger => {
  return {
    debug: (message: string, obj?: any): void => {
      // * logging to the console
      if (obj != null) {
        pretty(namespace, '[DEBUG]', message, obj)
      } else {
        pretty(namespace, '[DEBUG]', message)
      }

      // ** generating a log to a log file
      fileLogger.debug(`[${namespace}] ${message}`)
    },
    info: (message: string, obj?: any): void => {
      // * logging to the console
      if (obj != null) {
        pretty(namespace, '[INFO]', message, obj)
      } else {
        pretty(namespace, '[INFO]', message)
      }

      // ** generating a log to a log file
      fileLogger.info(`[${namespace}] ${message}`)
    },
    warn: (message: string, obj?: any): void => {
      // * logging to the console
      if (obj != null) {
        pretty(namespace, '[WARN]', message, obj)
      } else {
        pretty(namespace, '[WARN]', message)
      }

      // ** generating a log to a log file
      fileLogger.warn(`[${namespace}] ${message}`)
    },
    error: (message: string, obj?: any): void => {
      // * logging to the console
      if (obj != null) {
        pretty(namespace, '[ERROR]', message, obj)
      } else {
        pretty(namespace, '[ERROR]', message)
      }

      // ** generating a log to a log file
      fileLogger.error(`[${namespace}] ${message}`)
    }
  }
}

export default logger
