/*
 * Lambda function that implements the get licence functionality
 */
const Log = require('@dazn/lambda-powertools-logger');
const { getLicenceHistory } = require('./helper/licence');
const LicenceNotFoundError = require('./lib/LicenceNotFoundError');
const middy = require('@middy/core')
const cors = require('@middy/http-cors')

const handler = async (event) => {
  const { licenceid } = event.pathParameters;
  Log.debug(`In the get-licence-history handler with licenceid ${licenceid}`);

  try {
    const response = await getLicenceHistory(licenceid);
    const licence = JSON.parse(response);

    Log.debug(`Returning: ${JSON.stringify(licence)}`);

    return {
      statusCode: 200,
      body: JSON.stringify(licence),
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