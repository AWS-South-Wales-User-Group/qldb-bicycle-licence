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


const viaCreateLicenceHandler = async (event, functionName) => {
  const handler = require(`${APP_ROOT}/functions/${functionName}`).handler
  const response = await handler(event, {});
  const licence = JSON.parse(response.body);
  licenceId = licence.licenceId;
  return response;
}

const viaHandler = async (event, functionName) => {
    const handler = require(`${APP_ROOT}/functions/${functionName}`).handler
    const context = {}
    const response = await handler(event, context);
    return response;
}

const we_invoke_create_licence = () => viaCreateLicenceHandler({
    body: JSON.stringify(bicycleLicence)
}, 'create-licence')

const we_invoke_duplicate_licence = () => viaHandler({
    body: JSON.stringify(bicycleLicence)
}, 'create-licence')

const we_invoke_update_licence = () => viaHandler({
    body: JSON.stringify({
        "licenceId": licenceId,
        "points": 3
    })
}, 'update-licence')

const we_invoke_get_licence = () => viaHandler({
    pathParameters: {"licenceid": licenceId}
}, 'get-licence')

const we_invoke_history_licence = () => viaHandler({
    pathParameters: {"licenceid": licenceId}
}, 'get-licence-history')

const we_invoke_delete_licence = () => viaHandler({
    body: JSON.stringify({ "licenceId": licenceId })
}, 'delete-licence')

module.exports = {
  we_invoke_create_licence,
  we_invoke_duplicate_licence,
  we_invoke_update_licence,
  we_invoke_get_licence,
  we_invoke_history_licence,
  we_invoke_delete_licence
}