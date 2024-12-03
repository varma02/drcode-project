import db, { db_connect } from "./connection";
import fs from 'fs';
import path from 'path';
import readline from 'readline';

async function _apply_migrations(start: number, force: boolean = false): Promise<boolean> {
  const migrationsDir = path.join(__dirname, './migrations');
  const filenames = fs.readdirSync(migrationsDir);
  for (const file of filenames) {
    const migrationNumber = parseInt(file.match(/^\d+/)?.[0] || '0');
    if (migrationNumber <= start) continue;
    const filePath = path.join(migrationsDir, file);
    const migration = fs.readFileSync(filePath, 'utf-8');
    try {
      if (!force && migration.trim().startsWith('-- REQUIRES RESET')) {
        console.log(`Migration ${file} requires a reset. Aborting.`);
        return false;
      }
      await db.query(migration);
      console.log(`Applied migration: ${file}`);
    } catch (error) {
      console.error(`Error applying migration ${file}:`, error);
      return false;
    }
  }
  return true;
}

async function reset() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const confirmReset = await new Promise((resolve) => {
    console.log("\nDoing this will reset the database and \x1b[31m all data will be lost. \x1b[0m");
    rl.question('Are you sure you want to continue? (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim() === 'y');
    });
  });

  if (!confirmReset) {
    console.log("Database reset aborted.");
    return;
  }

  try {
    await db.query(`
      BEGIN TRANSACTION;
      DEFINE NAMESPACE IF NOT EXISTS ${process.env.DB_NAMESPACE || "DRCODE"};
      REMOVE DATABASE IF EXISTS ${process.env.DB_DATABASE || "main"};
      DEFINE DATABASE ${process.env.DB_DATABASE || "main"};
      COMMIT TRANSACTION;
    `);
    console.log("Database reset successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
    return;
  }

  if (await _apply_migrations(0, true)) {
    
    console.log("Seeding database...");
    const seed = fs.readFileSync(path.join(__dirname, './seed.surql'), 'utf-8');
    await db.query(seed);
    console.log("Seed data applied.");
  }
}

async function migrate() {
  const db_version = (await db.query<number[]>('RETURN $db_version;'))[0] || 0;
  await _apply_migrations(db_version);
}

async function create_migration() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const migration_name = await new Promise((resolve) => {
    rl.question('Enter the name of the migration: ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim().replaceAll(" ", "_"));
    });
  });

  const migrationsDir = path.join(__dirname, './migrations');
  if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir);
  const max_migration = fs.readdirSync(migrationsDir).reduce((prev, val) => {
    const num = parseInt(val.match(/^\d+/)?.[0] || '0');
    return num > prev ? num : prev;
  }, 0);
  const filename = `${(max_migration+1).toString().padStart(3, "0")}_${migration_name}.surql`;
  const filePath = path.join(migrationsDir, filename);
  const content = `
    -- Migration name: ${migration_name}
    -- Created at: ${new Date().toISOString()}
    -- Put "-- REQUIRES RESET" in the first line to require a reset for this migration
    
    BEGIN TRANSACTION;
    DEFINE PARAM OVERWRITE $db_version VALUE ${max_migration+1};

    -- Your migration code here
    
    COMMIT TRANSACTION;
  `.trim().replaceAll(/^ {4}/gm, '');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Created new migration file: ${filename}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  await db_connect();
  switch (command) {
    case 'reset':
      await reset();
      break;
    case 'migrate':
      await migrate();
      break;
    case 'create_migration':
      await create_migration();
      break;
    default:
      console.log(`Unknown command: ${command}\nOptions: reset, migrate, create_migration`);
      break;
  }
  await db.close();
}

if (require.main === module) {
  main();
}