const { Client } = require("pg");
const db = new Client({
  user: "landonschlangen",
  password: "CS366",
  host: "localhost",
  port: 5432,
  database: "file_upload",
});
execute();
async function execute() {
  await connect();
}
async function connect() {
  try {
    await db.connect();
    console.log(`Connected`);
    // console.log(db);
  } catch (e) {
    console.error(`connection failed ${e}`);
  }
}

module.exports = db;
