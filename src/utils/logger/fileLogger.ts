// libraries
import { createLogger, format, transports } from 'winston'
// files
import options from '../../config/winston'
// varialbes
const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${String(timestamp)}] ${level.toUpperCase()} - ${message}`
})

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File(options(String(process.env.NODE_ENV)).rotateLog)
  ]
})

export default logger
