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
    context('Given no entries,', () => {
      it("It responds 200 with empty list", () => {
        return supertest(app)
          .get("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });  
    })

    context("Given entries in db", () => {
      beforeEach(() => helpers.seedRunEntriesTable(db, testEntries));

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

      beforeEach("insert malicious entry", () => 
        helpers.seedMaliciousRunEntry(db, maliciousRunEntry)
      );

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

    it("creates a new run entry, responding with 201 and new entry", () => {
      const newEntry = {...testEntries[0]};

      const testUser = testUsers[0];
      newEntry.id = JSON.stringify(
        new Date() + Math.floor(Math.random() * 1000)
      );

      return supertest(app)
        .post("/api/runs")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newEntry)
        .expect(201)
        .then((returnedEntry) => {
          return supertest(app)
            .get(`/api/runs/${newEntry.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(200)
            .then((fetchedEntry) => {
              fetchedEntry.body.user_id = Number(fetchedEntry.body.user_id);
              fetchedEntry.body.public = Boolean(fetchedEntry.body.public);
              expect(fetchedEntry.body).to.eql(newEntry);
            });
        });
    });

    it("creates a new run entry, checking required fields", () => {
      const newEntry = {...testEntries[0]};
      const testUser = testUsers[0];
      newEntry.id = JSON.stringify(
        new Date() + Math.floor(Math.random() * 1000)
      );

      return supertest(app)
        .post("/api/runs")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newEntry)
        .expect(201)
        .then((returnedEntry) => {
          return supertest(app)
            .get(`/api/runs/${newEntry.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(200)
            .then((fetchedEntry) => {
              fetchedEntry.body.user_id = Number(fetchedEntry.body.user_id);
              fetchedEntry.body.public = Boolean(fetchedEntry.body.public);
              expect(fetchedEntry.body).to.eql(newEntry);
            });
        });
    });

    const requiredFields = [
      "id",
      "date",
      "location",
      "distance",
      "hours",
      "minutes",
      "seconds",
    ];

    const allInvalidFields = [];
    const testEntryCopy = {...testEntries[1]};

    requiredFields.forEach((field) => {
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        let testEntry = testEntryCopy;
        const testUser = testUsers[0];
        // Delete required field
        delete testEntry[field];

        return supertest(app)
          .post("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(testEntry)
          .expect(400)
          .then((response) => {
            if (response.status === 400) {
              allInvalidFields.push(field);
              expect(response.text).to.equal(
                `{"error":"Required properties are missing: ${allInvalidFields.join(
                  ", "
                )}"}`
              );
            }
          });
      });
    });

    context("Given an XSS attack entry", () => {
      const testUser = helpers.makeUsersArray()[0];
      const {
        maliciousRunEntry,
        expectedRunEntry,
      } = helpers.makeMaliciousRunEntry(testUser);

      it("removes XSS attack content", () => {
        return supertest(app)
          .post("/api/runs")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(maliciousRunEntry)
          .expect(201)
          .then((response) => {
            return supertest(app)
              .get(`/api/runs/${maliciousRunEntry.id}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(200)
              .then((fetchedEntry) => {
                expect(fetchedEntry.body.location).to.eql(
                  expectedRunEntry.location
                );
                expect(fetchedEntry.body.notes).to.eql(expectedRunEntry.notes);
              });
          });
      });
    });
  });

  describe("DELETE /api/runs/:run_id", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    const testUser = testUsers[0];

    context("given no run entries in the database", () => {
      it("responds with 404", () => {
        const runId = "123456";
        return supertest(app)
          .delete(`/api/runs/${runId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Run entry does not exist` });
      });
    });

    context("given there are run entries in the database", () => {
      beforeEach(() => helpers.seedRunEntriesTable(db, [testEntries[0]]));

      it("responds with 204 and removes the run entry", () => {
        const idToRemove = "1";
        return supertest(app)
          .delete(`/api/runs/${idToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then((res) => {
            return supertest(app)
              .get(`/api/runs/${idToRemove}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(404);
          });
      });
    });
  });


  describe("PATCH /api/runs/:run_id", () => {

    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    const testUser = testUsers[0];

    context("given no run entries in the database", () => {
      it("responds with 404", () => {
        const runId = "123456";
        return supertest(app)
          .patch(`/api/runs/${runId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Run entry does not exist` });
      });
    });

    beforeEach(() => helpers.seedRunEntriesTable(db, testEntries));

    context("given the are run entries in the database", () => {    
      it("responds with 204 and updates the run entry", () => {

        const idToUpdate = "1";
        const expectedNote = {
          ...testEntries[0],
          public: "true",
          location: "updated location",
        };

        return supertest(app)
          .patch(`/api/runs/${idToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(expectedNote)
          .expect(204)
          .then((res) => {
            return supertest(app)
              .get(`/api/runs/${idToUpdate}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect({...expectedNote, user_id: "1"})
          });
      });
    });
    
    it('responds with 400 when none of the required fields are supplied', () => {
      const idToUpdate = "1";
      return supertest(app)
      .patch(`/api/runs/${idToUpdate}`)
      .set("Authorization", helpers.makeAuthHeader(testUser))
      .send({ irrelevantField: 'foo' })
      .expect(400)
    })
  });
});