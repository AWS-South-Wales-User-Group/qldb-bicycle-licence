'use strict';

module.exports = {
  createBicycleLicence,
  generateRandom,
  createNewAddress
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function createBicycleLicence(userContext, events, done) {
  // generate data with Faker:
  const firstName = `${Faker.name.firstName()}`;
  const lastName = `${Faker.name.lastName()}`;
  const email = firstName + `.` + lastName + `@email.com`;
  const street = `${Faker.address.streetName()}`;
  const county = `${Faker.address.state()}`;
  const postcode = `${Faker.address.zipCode()}`;

  // add variables to virtual user's context:
  userContext.vars.firstName = firstName;
  userContext.vars.lastName = lastName;
  userContext.vars.email = email;
  userContext.vars.street = street;
  userContext.vars.county = county;
  userContext.vars.postcode = postcode;

  // continue with executing the scenario:
  return done();
}

function createNewAddress(userContext, events, done) {
  // generate data with Faker:
  const street = `${Faker.address.streetName()}`;
  const county = `${Faker.address.state()}`;
  const postcode = `${Faker.address.zipCode()}`;

  // add variables to virtual user's context:
  userContext.vars.street = street;
  userContext.vars.county = county;
  userContext.vars.postcode = postcode;

  // continue with executing the scenario:
  return done();
}

function generateRandom(userContext, events, done) {
  // generate data with Faker:
  const random = `${Faker.random.number({min:1, max:3})};`;

  // add variables to virtual user's context:
  userContext.vars.random = random;

  // continue with executing the scenario:
  return done();
}