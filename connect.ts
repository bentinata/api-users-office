import * as pg from "pg";
import { env } from "process";

async function main() {
  const client = new pg.Client({
    host: "127.0.0.1",
    user: env["POSTGRES_USER"],
    password: env["POSTGRES_PASSWORD"],
    database: env["POSTGRES_DB"],
  });

  await client.connect();

  const res = await client.query("SELECT * FROM users");

  console.log("====================================");
  console.log({ users: res.rows });
  console.log("====================================");
}

main();
