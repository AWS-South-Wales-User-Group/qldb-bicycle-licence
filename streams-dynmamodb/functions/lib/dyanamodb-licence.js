const Log = require('@dazn/lambda-powertools-logger');
const LicenceNotFoundError = require('./LicenceNotFoundError');

// see https://theburningmonk.com/2019/03/just-how-expensive-is-the-full-aws-sdk/
const DynamoDB = require('aws-sdk/clients/dynamodb');

const dynamodb = new DynamoDB.DocumentClient();

const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureAWS(require('aws-sdk'));

const { TABLE_NAME } = process.env;

const deleteLicence = async (id, version) => {
  Log.debug(`In deleteLicence function with id ${id} and version ${version}`);

  const params = {
    TableName: TABLE_NAME,
    Key: { pk: id },
    UpdateExpression: 'set version=:version, isDeleted=:isDeleted',
    ExpressionAttributeValues: {
      ':version': version,
      ':isDeleted': true,
    },
    ConditionExpression: 'attribute_not_exists(pk) OR version <= :version',
  };

  try {
    await dynamodb.update(params).promise();
    Log.debug(`Successful deleted id ${id} with version ${version}`);    
  } catch(err) {
    Log.debug(`Unable to update licence: ${id}. Error: ${err}`);
  }
};

const getLicence = async (id) => {
  Log.debug(`In getLicence function with id ${id}`);

  const params = {
    TableName: TABLE_NAME,
    Key: { pk: id }
  };
  const data = await dynamodb.get(params).promise();
  const item = data.Item;

  console.log('data.length: ' + data.length);

  if (!data.Item) {
    throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with LicenceId ${id} does not exist`);
  } else {
    if (item.isDeleted) {
      throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with LicenceId ${id} does not exist`);
    } else {
      return {
        id: item.pk,
        penaltyPoints: item.penaltyPoints,
        postcode: item.postcode,
      };  
    }
  }
};

const updateLicence = async (id, points, postcode, version) => {
  Log.debug(`In updateLicence function with id ${id} points ${points} postcode ${postcode} and version ${version}`);
  const params = {
    TableName: TABLE_NAME,
    Key: { pk: id },
    UpdateExpression: 'set penaltyPoints=:points, postcode=:code, version=:version',
    ExpressionAttributeValues: {
      ':points': points,
      ':code': postcode,
      ':version': version,
    },
    ConditionExpression: 'attribute_not_exists(pk) OR version <= :version',
  };

  try {
    await dynamodb.update(params).promise();
    Log.debug(`Successful updated id ${id} with points ${points} postcode ${postcode} and version ${version}`);    
  } catch(err) {
    Log.debug(`Unable to update licence: ${id}. Error: ${err}`);
  }
};

module.exports = {
  deleteLicence,
  updateLicence,
  getLicence,
};
