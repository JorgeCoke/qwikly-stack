import 'dotenv/config';

const { spawn } = require("node:child_process");
const env = { ...process.env };

async function resetDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error(`process.env.DATABASE_URL is not defined!`)
    }
    await exec(`rm -f ${process.env.DATABASE_URL}`)
    await exec(`touch ${process.env.DATABASE_URL}`)
    console.log("Removed all data from database!")
}

resetDb();

function exec(command: string) {
  const child = spawn(command, { shell: true, stdio: "inherit", env });
  return new Promise((resolve, reject) => {
    child.on("exit", (code: number) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`${command} failed rc=${code}`));
      }
    });
  });
}
