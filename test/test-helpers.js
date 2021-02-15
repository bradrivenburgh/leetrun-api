const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      first_name: "Test 1",
      last_name: "User 1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      first_name: "Test 2",
      last_name: "User 2",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      user_name: "test-user-3",
      first_name: "Test 3",
      last_name: "User 3",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      user_name: "test-user-4",
      first_name: "Test 4",
      last_name: "User 4",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeRunEntriesArray(users) {
  return [
    {
      id: "1",
      date: "2021-02-01",
      location: "Philadelphia, PA",
      distance: "5",
      hours: "00",
      minutes: "17",
      seconds: "00",
      notes: "Great run!",
      public: true,
      weather: "clear",
      surface: "pavement",
      terrain: "flat",
      user_id: users[0].id,
    },
    {
      id: "2",
      date: "2021-02-01",
      location: "Philadelphia, PA",
      distance: "5",
      hours: "00",
      minutes: "17",
      seconds: "00",
      notes: "Great run!",
      public: true,
      weather: "clear",
      surface: "pavement",
      terrain: "flat",
      user_id: users[1].id,
    },
    {
      id: "3",
      date: "2021-02-01",
      location: "Philadelphia, PA",
      distance: "5",
      hours: "00",
      minutes: "17",
      seconds: "00",
      notes: "Great run!",
      public: true,
      weather: "clear",
      surface: "pavement",
      terrain: "flat",
      user_id: users[2].id,
    },
    {
      id: "4",
      date: "2021-02-01",
      location: "Philadelphia, PA",
      distance: "5",
      hours: "00",
      minutes: "17",
      seconds: "00",
      notes: "Great run!",
      public: true,
      weather: "clear",
      surface: "pavement",
      terrain: "flat",
      user_id: users[3].id,
    },
  ];
}

function makeExpectedRunEntry(users, entry) {
  const user = users.find((user) => user.id === entry.user_id);

  return {
    id: entry.id,
    date: entry.date,
    location: entry.location,
    distance: entry.distance,
    hours: entry.hours,
    minutes: entry.minutes,
    seconds: entry.seconds,
    notes: entry.notes,
    public: entry.public,
    weather: entry.weather,
    surface: entry.surface,
    terrain: entry.terrain,
    user_id: user.id,
  };
}

function makeMaliciousRunEntry(user) {
  const maliciousRunEntry = {
    id: "911",
    date: "2021-02-01",
    location: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    distance: "5",
    hours: "00",
    minutes: "17",
    seconds: "00",
    notes: 'Naughty naughty very naughty <script>alert("xss");</script>',
    public: true,
    weather: "clear",
    surface: "pavement",
    terrain: "flat",
    user_id: user.id,
  }

  const expectedRunEntry = {
    ...makeExpectedRunEntry([user], maliciousRunEntry),
    location: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    notes: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
  }
  return {
    maliciousRunEntry,
    expectedRunEntry,
  }
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testEntries = makeRunEntriesArray(testUsers);
  return { testUsers, testEntries };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        run_entries,
        leetrun_users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE leetrun_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('leetrun_users_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("leetrun_users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('leetrun_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function seedRunEntriesTable(db, users, entries) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('run_entries').insert(entries);
  });
}

function seedMaliciousRunEntry(db, user, entry) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('run_entries')
        .insert([entry])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeRunEntriesArray,
  makeExpectedRunEntry,
  makeMaliciousRunEntry,


  makeFixtures,
  cleanTables,
  seedRunEntriesTable,
  seedMaliciousRunEntry,
  makeAuthHeader,
  seedUsers,
};
