"use strict";
const db = require("../db/db");

module.exports.up = async function (next) {
  await db.query(
    `CREATE TABLE files ` +
      `(id serial ` +
      `NOT NULL Primary key, ` +
      `title varchar(255) NOT NULL, ` +
      `description varchar(255) NOT NULL, ` +
      `file_path varchar(255) NOT NULL, ` +
      `file_mimetype varchar(255) NOT NULL)`
  );
  next();
};

module.exports.down = async function (next) {
  await db.query("DROP TABLE files");
  next();
};
