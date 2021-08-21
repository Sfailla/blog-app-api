const mongoose = require('mongoose')
const colorTerminal = require('../../../config/terminalColors')
const { ValidationError } = require('../../middleware/utils/errors')
const { ObjectId } = mongoose.Types

const makeDbConnection = async () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 1000,
    promiseLibrary: global.Promise
  }

  const url = process.env.MONGOOSE_URL

  mongoose.connection.on('connected', () => {
    const msg = `Mongoose connection established to MLAB database`
    console.log(colorTerminal('magenta'), msg)
  })

  mongoose.connection.on('error', err => {
    const msg = `Mongoose default connection has occured ${err} error`
    console.log(colorTerminal('red'), msg)
  })

  mongoose.connection.on('disconnected', () => {
    const msg = 'Mongoose default connection is disconnected'
    console.log(colorTerminal('red'), msg)
  })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      const msg = 'Mongoose default connection is disconnected due to application termination'
      console.log(colorTerminal('red'), msg)
      process.exit(0)
    })
  })

  try {
    const connect = await mongoose.connect(url, mongooseOptions)
    return connect
  } catch (err) {
    return new ValidationError(500, err.toString())
  }
}

const isValidObjId = userId => {
  return ObjectId.isValid(userId) && new ObjectId(userId).toString('hex') === userId.toString('hex')
}

module.exports = {
  isValidObjId,
  makeDbConnection
}
