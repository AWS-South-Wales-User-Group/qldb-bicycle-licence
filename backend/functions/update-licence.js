const Log = require('@dazn/lambda-powertools-logger');
const dateFormat = require('dateformat');
const { updateLicence } = require('./helper/licence');
/*
 * Lambda function that implements the update licence functionality
 */

const LicenceIntegrityError = require('./lib/LicenceIntegrityError');

module.exports.handler = async (event) => {
  const { licenceId, points } = JSON.parse(event.body);
  Log.debug(`In the update licence handler with licenceId ${licenceId} and points ${points}`);
  let eventInfo;
  try {
    if (points > 0) {
      eventInfo = { eventName: 'PenaltyPointsAdded', points: points, eventDate: dateFormat(new Date(), 'isoDateTime') };
    } else {
      eventInfo = { eventName: 'PenaltyPointsRemoved', points: points, eventDate: dateFormat(new Date(), 'isoDateTime') };
    }
    const response = await updateLicence(licenceId, points, eventInfo);
    return {
      statusCode: 200,
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
