const when = require('../steps/when')
const { init } = require('../steps/init')


describe(`When we call create licence with new data`, () => {
    beforeAll(async () => await init())
    it(`Should return a new bicycle licence`, async () => {
      const res = await when.we_invoke_create_licence();
      const licence = JSON.parse(res.body);
      expect(res.statusCode).toEqual(201);
      expect(licence.email).toEqual("joe.bloggs@email.com");
    })
})


describe(`When we invoke create licence with duplicate data`, () => {
    beforeAll(async () => await init())
    it(`Should return a Licence Integrity Error`, async () => {
      const res = await when.we_invoke_duplicate_licence();
      const licence = JSON.parse(res.body);
      expect(res.statusCode).toEqual(400);
      expect(licence.title).toEqual("Licence Integrity Error");
    })
})

describe(`When we call update licence`, () => {
    beforeAll(async () => await init())
    it(`Should return updated licence details`, async () => {
      const res = await when.we_invoke_update_licence();
      const licence = JSON.parse(res.body);
      expect(licence.updatedPenaltyPoints).toEqual(3);
    })
})
