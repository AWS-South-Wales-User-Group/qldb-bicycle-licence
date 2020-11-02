/*
 * Lambda function that implements the get licence functionality
 */
const Log = require('@dazn/lambda-powertools-logger');
const middy = require('@middy/core')
const cors = require('@middy/http-cors')
const { sendRequest } = require('./helper/es-licence');


const handler = async (event) => {
  const { lastname } = event.pathParameters;
  Log.debug(`In the es-fuzzy-search handler with lastname ${lastname}`);

  try {

    const doc = {
      "query": {
        "wildcard": {
          "lastName": {
            "value": lastname + '*'
          }
        }
      }
    }

    response = await sendRequest({
      httpMethod: 'POST',
      requestPath: `licence/_search`,
      payload: doc,
    });
    Log.debug(`RESPONSE: ${JSON.stringify(response)}`);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
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