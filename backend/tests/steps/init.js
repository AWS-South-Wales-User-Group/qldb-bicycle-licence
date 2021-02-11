const { promisify } = require('util')
const awscred = require('awscred')
require('dotenv').config()

let initialized = false

const init = async () => {
  if (initialized) {
    return
  }
  
  const { credentials, region } = await promisify(awscred.load)()
  
  process.env.AWS_ACCESS_KEY_ID     = credentials.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey
  process.env.AWS_REGION            = "eu-west-1"


  process.env.AWS_XRAY_CONTEXT_MISSING = "LOG_ERROR";
  process.env.AWS_XRAY_LOG_LEVEL= "silent";


  if (credentials.sessionToken) {
    process.env.AWS_SESSION_TOKEN = credentials.sessionToken
  }

  console.log('AWS credential loaded')

  initialized = true
}

module.exports = {
  init
}


