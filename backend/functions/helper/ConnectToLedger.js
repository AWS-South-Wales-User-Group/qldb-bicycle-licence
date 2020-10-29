/*
 * Helper utility from the Amazon DMV QLDB sample application for Nodejs.
 * This is used to get a QldbDriver - the entry point for all interactions
 * with QLDB
 */

const { QldbDriver, RetryConfig } = require('amazon-qldb-driver-nodejs');

const qldbDriver = createQldbDriver();


/**
 * Create a driver for interacting with QLDB.
 * @param ledgerName The name of the ledger to create the driver on.
 * @param serviceConfigurationOptions Configurations for the AWS SDK client that the driver uses.
 * @returns The driver for interacting with the specified ledger.
 */
function createQldbDriver(
  ledgerName = process.env.LEDGER_NAME,
  serviceConfigurationOptions = {},
) {
  //Use driver's default backoff function (and hence, no second parameter provided to RetryConfig)
  const retryConfig = new RetryConfig(4);
  const qldbDriver = new QldbDriver(ledgerName, serviceConfigurationOptions, 10, retryConfig);
  return qldbDriver;
}

/**
 * Retrieve a driver for interacting with QLDB.
 * @returns The driver for interacting with the specified ledger.
 */
function getQldbDriver() {
  return qldbDriver;
}

module.exports = {
  getQldbDriver,
};
