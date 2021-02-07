const APP_ROOT = '../../'

let licenceId;

const bicycleLicence = {
    "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "joe.bloggs@email.com",
    "street": "Unknown street",
    "county": "Unknown county",
    "postcode": "AB12CDE"
}

const updateLicence = {
    "licenceId": licenceId,
    "points": 3
}

const viaCreateLicenceHandler = async (event, functionName) => {
  const handler = require(`${APP_ROOT}/functions/${functionName}`).handler
  const response = await handler(event, {});
  const licence = JSON.parse(response.body);
  updateLicence.licenceId = licence.licenceId;
  console.log(`LicenceID: ${licenceId}`)
  return response;
}

const viaDuplicateLicenceHandler = async (event, functionName) => {
    const handler = require(`${APP_ROOT}/functions/${functionName}`).handler
    const context = {}
    const response = await handler(event, {});
    return response;
}

const viaUpdateLicenceHandler = async (event, functionName) => {
    const handler = require(`${APP_ROOT}/functions/${functionName}`).handler
    console.log(event);
    const context = {}
    const response = await handler(event, {});
    console.log(JSON.stringify(response));
    return response;
}

const we_invoke_create_licence = () => viaCreateLicenceHandler({
    body: JSON.stringify(bicycleLicence)
}, 'create-licence')

const we_invoke_duplicate_licence = () => viaDuplicateLicenceHandler({
    body: JSON.stringify(bicycleLicence)
}, 'create-licence')

const we_invoke_update_licence = () => viaUpdateLicenceHandler({
    body: JSON.stringify(updateLicence)
}, 'update-licence')


module.exports = {
  we_invoke_create_licence,
  we_invoke_duplicate_licence,
  we_invoke_update_licence
}