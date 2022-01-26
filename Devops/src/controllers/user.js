const db = require("../dbClient");

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username)
      return callback(new Error("Wrong user parameters"), null);
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    // Check if user already exists
    db.hgetall(user.username, function (err, res) {
      if (err) return callback(err, null);
      if (!res) {
        // Save to DB
        db.hmset(user.username, userObj, (err, res) => {
          if (err) return callback(err, null);
          callback(null, res); // Return callback
        });
      } else {
        callback(new Error("User already exists"), null);
      }
    });
  },
  get: (username, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);
    db.hgetall(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) callback(null, res);
      else callback(new Error("User doesn't exists"), null);
    });
  },
  update: (username, user, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    //we check if the user  exists
    db.hgetall(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) {
        // Save to DB
        db.hmset(username, userObj, (err, res) => {
          if (err) return callback(err, null);
          callback(null, res); // Return callback
        });
      } else {
        callback(new Error("User already exists"), null);
      }
    });
    if (!username)
      return callback(new Error("Username must be provided"), null);
  },

  delete: (username, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);

    //we check if the user  exists
    db.hgetall(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) {
        db.del(username, function (err, result) {
          if (err) return callback(err, null);
          if (res) return callback(null, result);
        });
      } else {
        callback(new Error("User doesn't exists"), null);
      }
    });
  },
};
