const xss = require('xss');

const RunService = {
  getUserRuns(userId, db) {
    return db
      .select('*')
      .from('run_entries')
      .where('user_id', userId)
      .orderBy('date', 'desc');
  },

  getById(id, db) {
    return db
      .select('*')
      .from('run_entries')
      .where('id', id)
      .first();
  },

  insertRun(newRun, db) {
    return db
      .insert(newRun)
      .into('run_entries')
      .returning('*')
  },

  deleteRun(id, db) {
    return db
      .select('*')
      .from('run_entries')
      .where({ id })
      .delete();
  },

  updateRun(newRunData, id, db) {
    return db
      .select('*')
      .from('run_entries')
      .where({ id })
      .update(newRunData);
  },

  serializeRuns(runEntries) {
    const entry = runEntries;
    return {
      id: xss(entry.id),
      date: xss(entry.date),
      location: xss(entry.location),
      distance: xss(entry.distance),
      hours: xss(entry.hours),
      minutes: xss(entry.minutes),
      seconds: xss(entry.seconds),
      notes: xss(entry.notes),
      public: xss(entry.public),
      weather: xss(entry.weather),
      surface: xss(entry.surface),
      terrain: xss(entry.terrain),
      user_id: xss(entry.user_id),
    }
  }
};

module.exports = RunService;