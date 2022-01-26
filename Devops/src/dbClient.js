var redis = require("redis");
const configure = require("./configure");

const config = configure();

var db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  retry_strategy: (options) => {
    if (options.attempt > 50) {
      // End reconnecting with built in error
      return undefined;
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands with an individual error
      return new Error("Retry time exhausted");
    }
    if (
      options.error &&
      (options.error.code === "ECONNREFUSED" ||
        options.error.code === "NR_CLOSED")
    ) {
      // Try reconnecting after 5 seconds
      console.error(
        "The server refused the connection. Retrying connection..."
      );
      return 5000;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

process.on("SIGINT", function () {
  db.quit();
});

module.exports = db;
