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

describe(`When we call get licence`, () => {
  beforeAll(async () => await init())
  it(`Should return licence details`, async () => {
    const res = await when.we_invoke_get_licence();
    const licence = JSON.parse(res.body);
    expect(res.statusCode).toEqual(200);
    expect(licence.penaltyPoints).toEqual(3);
  })
})

describe(`When we call get licence history`, () => {
  beforeAll(async () => await init())
  it(`Should return history of licence details`, async () => {
    const res = await when.we_invoke_history_licence();
    expect(res.statusCode).toEqual(200);
  })
})


describe(`When we call delete licence`, () => {
  beforeAll(async () => await init())
  it(`Should delete the licence`, async () => {
    const res = await when.we_invoke_delete_licence();
    expect(res.statusCode).toEqual(201);
  })
})
