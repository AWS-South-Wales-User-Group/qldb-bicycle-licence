/*
 * Lambda function that implements the create licence functionality
 */
const Log = require('@dazn/lambda-powertools-logger');
const dateFormat = require('dateformat');
const { createLicence } = require('./helper/licence');
const LicenceIntegrityError = require('./lib/LicenceIntegrityError');
const middy = require('@middy/core')
const cors = require('@middy/http-cors')

const handler = async (event) => {
  const {
    firstName, lastName, email, street, county, postcode,
  } = JSON.parse(event.body);
  Log.debug(`In the create licence handler with: first name ${firstName} last name ${lastName} email ${email} street ${street} and county ${county} and postcode ${postcode}`);

  try {
    const eventInfo = { eventName: 'BicycleLicenceCreated', eventDate: dateFormat(new Date(), 'isoDateTime') };
    console.log('About to call out to create licence');
    const response = await createLicence(
      firstName, lastName, email, street, county, postcode, eventInfo
    );
    return {
      statusCode: 201,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log('Caught an error in the handler');
    if (error instanceof LicenceIntegrityError) {
      console.log('back in handler after having caught the LicenceIntegrityError');
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