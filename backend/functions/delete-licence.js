/*
 * Lambda function that implements the delete licence functionality
 */
const Log = require('@dazn/lambda-powertools-logger');
const { deleteLicence } = require('./helper/licence');
const LicenceNotFoundError = require('./lib/LicenceNotFoundError');
const middy = require('@middy/core')
const cors = require('@middy/http-cors')


const handler = async (event) => {
  const { licenceId } = JSON.parse(event.body);
  Log.debug(`In the delete licence handler for licenceid ${licenceId}`);

  try {
    const response = await deleteLicence(licenceId);
    const message = JSON.parse(response);
    return {
      statusCode: 201,
      body: JSON.stringify(message),
    };
  } catch (error) {
    if (error instanceof LicenceNotFoundError) {
      return error.getHttpResponse();
    }
    Log.error(`Error returned: ${error}`);
    const errorBody = {
      status: 500,
      title: error.name,
      detail: error.message,
    };
    return {
      statusCode: 500,
      body: JSON.stringify(errorBody),
    };
  }
};

module.exports.handler = middy(handler).use(cors())
