#!/usr/bin/env node
// NOTE: Fly.io config file

const { spawn } = require("node:child_process");

const env = { ...process.env };

(async () => {
  // If running the web server then migrate existing database
  if (process.argv.slice(2).join(" ") === "npm run serve") {
    await exec("npm run db:reset"); // TODO: Do not reset the database! Do a migration instead!
    // await exec("npm run db:migrate");
  }

  // launch application
  await exec(process.argv.slice(2).join(" "));
})();

function exec(command) {
  const child = spawn(command, { shell: true, stdio: "inherit", env });
  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed rc=${code}`));
      }
    });
  });
}
