const { expect } = require("chai");
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

    context("Given entries in db", () => {
      beforeEach(() => {
        helpers.seedRunEntriesTable(db, testEntries);
      });
      

      it("it responds with 200 and list user of entries", () => {
        const expectedRunEntries = testEntries.filter((entry) => {
          if (testUsers[0].id === entry.user_id) {
            return helpers.makeExpectedRunEntry([testUsers[0]], entry);
          }
        });

        return supertest(app)
          .get("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((response) => {
            // Coerce user_id to Number; supertest is sending it as a string
            // even though it is coming from an Integer type column in the db
            response.body[0].user_id = Number(response.body[0].user_id);
            expect(response.body).to.deep.equal(expectedRunEntries);
          });
      });
    });

    context("Given an XSS attack entry", () => {
      const testUser = helpers.makeUsersArray()[0];
      const {
        maliciousRunEntry,
        expectedRunEntry,
      } = helpers.makeMaliciousRunEntry(testUser);

      beforeEach("insert malicious entry", () => {
        return helpers.seedMaliciousRunEntry(db, maliciousRunEntry);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((response) => {
            expect(response.body[0].location).to.eql(expectedRunEntry.location);
            expect(response.body[0].notes).to.eql(expectedRunEntry.notes);
          });
      });
    });
  });
});
