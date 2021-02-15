const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Run Entries Endpoints", () => {
  let db;

  const { testUsers, testEntries } = helpers.makeFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/runs", () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));

    it("Given no entries, it responds 200 with empty list", () => {
      return supertest(app)
        .get("/api/runs")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(200, []);
    });
    
    context('Given entries in db', () => {
      beforeEach(() => {
        helpers.seedRunEntriesTable(db, testEntries);
      })

      it("it responds with 200 and list user of entries", () => {
      
        const expectedRunEntries = testEntries.map((entry) =>
          helpers.makeExpectedRunEntry(testUsers, entry)
        );
  
        return supertest(app)
          .get("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedRunEntries);
      });
        
    })
  });
});
