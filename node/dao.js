const { Client } = require("pg");

let DB = {};

function connect() {
  DB = new Client({
    host: "localhost",
    port: 5432,
    database: "final-project-music-albums",
    user: "postgres",
    password: "postgres"
  });

  DB.connect(error => {
    if (error) {
      throw error;
    } else {
      console.log("Connect to database");
    }
  });
}

function query(query_str, values, resultCallback) {
  DB.query(query_str, values, (error, result) => {
    if (error) {
      throw error;
    }
    resultCallback(result);
  });
}

function disconnect() {
  DB.end();
}
// export 3 functions using same name and make them available outside
module.exports = {
  connect: connect,
  disconnect: disconnect,
  query: query
};
