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
            // Coerce user_id / public to Number/Boolean; knex is converting it to 
            // a string even though it is coming from Integer/Boolean type columns 
            // in the db
            response.body[0].user_id = Number(response.body[0].user_id);
            response.body[0].public = Boolean(response.body[0].public);

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

  describe("POST /api/runs", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    beforeEach("insert run entries", () =>
      helpers.seedRunEntriesTable(db, testEntries)
    );

    it('creates a new run entry, responding with 201 and new entry', () => {
      const newEntry = testEntries[0];
      const testUser = testUsers[0];
      newEntry.id = JSON.stringify(new Date());

      return supertest(app)
        .post('/api/runs')
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newEntry)
        .expect(201)
        .then(returnedEntry => {
          return supertest(app)
            .get(`/api/runs/${newEntry.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(200)
            .then(fetchedEntry => {
              fetchedEntry.body.user_id = Number(fetchedEntry.body.user_id);
              fetchedEntry.body.public = Boolean(fetchedEntry.body.public);
              expect(fetchedEntry.body).to.eql(newEntry);
            })
        })
    })


  });
});
