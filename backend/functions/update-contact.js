/*
 * Lambda function that implements the update contact functionality
 */

const Log = require('@dazn/lambda-powertools-logger');
const dateFormat = require('dateformat');
const { updateContact } = require('./helper/licence');
const LicenceIntegrityError = require('./lib/LicenceIntegrityError');
const middy = require('@middy/core')
const cors = require('@middy/http-cors')

const handler = async (event) => {
  const {
    licenceId, street, county, postcode
  } = JSON.parse(event.body);
  const eventInfo = { eventName: 'ContactAddressUpdated', eventDate: dateFormat(new Date(), 'isoDateTime') };

  Log.debug(`In the update contact handler with: licenceId ${licenceId} street ${street} county ${county} and postcode ${postcode}`);

  try {
    const response = await updateContact(licenceId, street, county, postcode, eventInfo);
    return {
      statusCode: 201,
      body: JSON.stringify(response),
    };
  } catch (error) {
    if (error instanceof LicenceIntegrityError) {
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