/*
 * Helper utility that provides the implementation for interacting with QLDB
 */

const Log = require('@dazn/lambda-powertools-logger');
const { getQldbDriver } = require('./ConnectToLedger');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureAWS(require('aws-sdk'));
const LicenceIntegrityError = require('../lib/LicenceIntegrityError');
const LicenceNotFoundError = require('../lib/LicenceNotFoundError');

/**
 * Check if an email address already exists
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param email The email address of the licence holder.
 * @returns The number of records that exist for the email address
 */
async function checkEmailUnique(txn, email) {
  Log.debug('In checkEmailUnique function');
  const query = 'SELECT email FROM BicycleLicence AS b WHERE b.email = ?';
  let recordsReturned;
  await txn.execute(query, email).then((result) => {
    recordsReturned = result.getResultList().length;
    if (recordsReturned === 0) {
      Log.debug(`No records found for ${email}`);
    } else {
      Log.debug(`Record already exists for ${email}`);
    }
  });
  return recordsReturned;
}

/**
 * Insert the new Licence document to the BicycleLicence table
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param licenceDoc The document containing the details to insert.
 * @returns The Result from executing the statement
 */
async function createBicycleLicence(txn, licenceDoc) {
  Log.debug('In the createBicycleLicence function');
  const statement = 'INSERT INTO BicycleLicence ?';
  return txn.execute(statement, licenceDoc);
}

/**
 * Insert the new Licence document to the BicycleLicence table
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param id The document id of the document.
 * @param licenceId The licenceId to add to the document
 * @param email The email address of the licence holder.
 * @returns The Result from executing the statement
 */
async function addGuid(txn, docId, email) {
  Log.debug(`In the addGuid function with docId ${docId} and email ${email}`);
  const statement = 'UPDATE BicycleLicence as b SET b.licenceId = ? WHERE b.email = ?';
  return txn.execute(statement, docId, email);
}

/**
 * Creates a new licence record in the QLDB ledger.
 * @param firstName The first name of the licence holder.
 * @param lastName The last name of the licence holder.
 * @param email The email address of the licence holder.
 * @param street The street address of the licence holder.
 * @param county The county of the licence holder
 * @param postcode The postcode of the licence holder.
 * @param event The LicenceHolderCreated event record to add to the document.
 * @returns The JSON record of the new licence reecord.
 */
const createLicence = async (firstName, lastName, email, street, county, postcode, event) => {
  Log.debug(`In createLicence function with: first name ${firstName} last name ${lastName} email ${email} street ${street} county ${county} and postcode ${postcode}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Check if the record already exists assuming email unique for demo
    const recordsReturned = await checkEmailUnique(txn, email);
    if (recordsReturned === 0) {
      const licenceDoc = {
        firstName, lastName, email, street, county, postcode, penaltyPoints: 0, events: event,
      };
      // Create the record. This returns the unique document ID in an array as the result set
      const result = await createBicycleLicence(txn, licenceDoc);
      const docIdArray = result.getResultList();
      const docId = docIdArray[0].get('documentId').stringValue();
      // Update the record to add the document ID as the GUID in the payload
      await addGuid(txn, docId, email);
      console.log('Create the licence doc to return');
      licence = {
        licenceId: docId,
        firstName,
        lastName,
        penaltyPoints: 0,
        email,
        street,
        county,
        postcode,
      };
    } else {
      throw new LicenceIntegrityError(400, 'Licence Integrity Error', `Licence record with email ${email} already exists. No new record created`);
    }
  });
  return licence;
};

/**
 * Helper function to get the latest revision of document by email address
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param email The email address of the document to retrieve
 * @returns The Result from executing the statement
 */
async function getLicenceRecordByEmail(txn, email) {
  Log.debug('In getLicenceRecordByEmail function');
  const query = 'SELECT * FROM BicycleLicence WHERE email = ?';
  return txn.execute(query, email);
}

/**
 * Helper function to get the latest revision of document by document Id
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param id The document id of the document to retrieve
 * @returns The Result from executing the statement
 */
async function getLicenceRecordById(txn, id) {
  Log.debug('In getLicenceRecordById function');
  const query = 'SELECT * FROM BicycleLicence AS b WHERE b.licenceId = ?';
  return txn.execute(query, id);
}

/**
 * Helper function to get the latest revision of document by document Id
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param id The document id of the document to retrieve
 * @returns The Result from executing the statement
 */
async function getLicenceRecordHistoryById(txn, id) {
  Log.debug('In getLicenceRecordHistoryById function');
  const query = 'SELECT * FROM history(BicycleLicence) WHERE metadata.id = ?';
  return txn.execute(query, id);
}



/**
 * Helper function to update the document with new contact details
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param licenceId The licence ID of the document to update
 * @param street The latest street to update
 * @param county The latest county to update
 * @param postcode The latest postcode to update
 * @param eventInfo The event to add to the document
 * @returns The Result from executing the statement
 */
async function addContactUpdatedEvent(txn, licenceId, street, county, postcode, eventInfo) {
  Log.debug(`In the addContactUpdatedEvent function with licenceId ${licenceId}, street ${street}, county ${county}, postcode ${postcode} and events ${eventInfo}`);
  const statement = 'UPDATE BicycleLicence SET street = ?, county = ?, postcode = ?, events = ? WHERE licenceId = ?';
  return txn.execute(statement, street, county, postcode, eventInfo, licenceId);
}

/**
 * Helper function to update the licence with updated penalty points details
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param licenceId The licence ID of the document to update
 * @param points The latest points to update
 * @param eventInfo The event to add to the document
 * @returns The Result from executing the statement
 */
async function addPointsUpdatedEvent(txn, licenceId, points, eventInfo) {
  Log.debug(`In the addPointsUpdatedEvent function with licenceId ${licenceId}, points ${points} and events ${eventInfo}`);
  const statement = 'UPDATE BicycleLicence SET penaltyPoints = ?, events = ? WHERE licenceId = ?';
  return txn.execute(statement, points, eventInfo, licenceId);
}


/**
 * Update the Licence document with an PointsAdded or PointsRemoved event
 * @param email The email address of the document to update
 * @param event The event to add
 * @returns A JSON document to return to the client
 */
const updateLicence = async (licenceId, points, eventInfo) => {
  Log.debug(`In updateLicence function with licenceId ${licenceId}, points ${points} and eventInfo ${eventInfo}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Get the current record

    const result = await getLicenceRecordById(txn, licenceId);
    const resultList = result.getResultList();

    if (resultList.length === 0) {
      throw new LicenceIntegrityError(400, 'Licence Integrity Error', `Licence record with licenceId ${licenceId} does not exist`);
    } else {
      const originalLicence = JSON.stringify(resultList[0]);
      const newLicence = JSON.parse(originalLicence);
      const updatedPoints = parseInt(parseInt(newLicence.penaltyPoints)  + parseInt(points));

      await addPointsUpdatedEvent(txn, licenceId, updatedPoints, eventInfo);
      licence = {
        licenceId,
        updatedPenaltyPoints: updatedPoints,
      };
    }
  });
  return licence;
};


/**
 * Update the Licence document with new contact details
 * @param licenceId The licenceId of the document to update
 * @param street The updated street
 * @param county The updated county
 * @param postcode The updated postcode
 * @param eventInfo The event to add
 * @returns A JSON document to return to the client
 */
const updateContact = async (licenceId, street, county, postcode, eventInfo) => {
  Log.debug(`In updateContact function with licenceId ${licenceId} street ${street} county ${county} and postcode ${postcode}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Get the current record

    const result = await getLicenceRecordById(txn, licenceId);
    const resultList = result.getResultList();

    if (resultList.length === 0) {
      throw new LicenceIntegrityError(400, 'Licence Integrity Error', `Licence record with id ${licenceId} does not exist`);
    } else {
      await addContactUpdatedEvent(txn, licenceId, street, county, postcode, eventInfo);
      licence = {
        licenceId,
        response: 'Contact details updated',
      };
      console.log('Returned from the call to addContactUpdatedEvent');
    }
  });
  return licence;
};

/**
 * Helper function to delete the document
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param id The document id of the document to delete
 * @returns The Result from executing the statement
 */
async function deleteLicenceRecordById(txn, id) {
  Log.debug('In deleteLicenceRecordById function');
  const query = 'DELETE FROM BicycleLicence AS b WHERE b.licenceId = ?';
  return txn.execute(query, id);
}

/**
 * Helper function to retrieve the current state of a licence record
 * @param id The document id of the document to retrieve
 * @returns The JSON document to return to the client
 */
const getLicence = async (licenceId) => {
  Log.debug(`In getLicence function with licenceId ${licenceId}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Get the current record
    const result = await getLicenceRecordById(txn, licenceId);
    const resultList = result.getResultList();

    if (resultList.length === 0) {
      throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with licenceId ${licenceId} does not exist`);
    } else {
      licence = JSON.stringify(resultList[0]);
    }
  });
  return licence;
};

/**
 * Helper function to retrieve the current and historic states of a licence record
 * @param id The document id of the document to retrieve
 * @returns The JSON document to return to the client
 */
const getLicenceHistory = async (licenceId) => {
  Log.debug(`In getLicence function with licenceId ${licenceId}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Get the current record
    const result = await getLicenceRecordHistoryById(txn, licenceId);
    const licenceHistoryArray = result.getResultList();
    if (licenceHistoryArray.length === 0) {
      throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with licenceId ${licenceId} does not exist`);
    } else {
      licence = JSON.stringify(licenceHistoryArray);
    }
  });
  return licence;
};


/**
 * Function to delete a licence record
 * @param id The document id of the document to delete
 * @returns The JSON response to return to the client
 */
const deleteLicence = async (id) => {
  Log.debug(`In deleteLicence function with LicenceId ${id}`);

  let licence;
  // Get a QLDB Driver instance
  const qldbDriver = await getQldbDriver();
  await qldbDriver.executeLambda(async (txn) => {
    // Get the current record
    const result = await getLicenceRecordById(txn, id);
    const resultList = result.getResultList();

    if (resultList.length === 0) {
      throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with LicenceId ${id} does not exist`);
    } else {
      await deleteLicenceRecordById(txn, id);
      licence = '{"response": "Licence record deleted"}';
    }
  });
  return licence;
};

module.exports = {
  createLicence,
  updateLicence,
  getLicence,
  getLicenceHistory,
  updateContact,
  deleteLicence,
};
