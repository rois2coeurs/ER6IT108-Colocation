import {SQL} from "bun";
import {readdir} from "node:fs/promises";
import {parseArgs} from "util";

const {values} = parseArgs({
    args: Bun.argv,
    options: {
        test: {
            type: 'boolean',
            short : 't'
        },
        seed: {
            type: 'boolean',
            short : 's'
        },
        delete: {
            type: 'boolean',
            short : 'd'
        }
    },
    strict: true,
    allowPositionals: true,
});

let sql = new SQL({
    url: process.env.POSTGRES_URL
});

if (values.test) {
    console.log("Migrator using test database");
    sql = new SQL({
        url: process.env.POSTGRES_TEST_URL
    });
}

if (values.delete) {
    console.log("Are you sure you want to delete the database? (yes/no)");
    for await (const line of console) {
        if (line === "yes" || line === "y") {
            break;
        }
        console.log("Database deletion cancelled!");
        process.exit(0);
    }
    console.log("Migrator is deleting the database");
    await sql.begin(async tx => {
        await tx.file("./sql/deleter.sql");
    });
    console.log("Database deleted!");
    process.exit(0);
}

applyMigrations().then(async () => {
    if (values.seed) {
        await seedDatabase();
    }
    process.exit(0);
})

async function seedDatabase() {
    console.log("Migrator is seeding the database");
    await sql.begin(async tx => {
        await tx.file("./sql/seeder.sql");
    });
    console.log("Database seeded!");
}

async function applyMigrations() {
    const currentMigration = await getCurrentMigration();
    console.log("\nCurrent database version: " + currentMigration);
    const allMigrations = await getAllMigrations();
    const migrationsToApply = allMigrations.filter(migration => migration.split("_")[0] > currentMigration).sort((a, b) => a.localeCompare(b));
    console.log("Migrations to apply: " + migrationsToApply.length);
    for (const migration of migrationsToApply) {
        if (!/[0-9]+_[a-zA-Z0-9\-_]+.sql/.test(migration)) {
            throw new Error("Invalid migration file: " + migration);
        }
        process.stdout.write("Applying " + migration + "...");
        await applyMigration(migration);
        console.log("OK!");
    }
    console.log("The database is up to date!\n");
}

async function applyMigration(migration: string) {
    await sql.begin(async tx => {
        await tx.file("./sql/migrations/" + migration);
        await tx`INSERT INTO migrationVersion (version)
                 VALUES (${migration.split('_')[0]})`;
    });
}

async function getAllMigrations() {
    return await readdir("./sql/migrations");
}

async function getCurrentMigration() {
    if (await migrationTableExists()) {
        const result = await sql`SELECT version
                                 FROM migrationVersion
                                 ORDER BY version DESC
                                 LIMIT 1;`;
        return result[0].version;
    } else {
        await createMigrationTable();
        return 0;
    }
}

async function migrationTableExists() {
    const result = await sql`SELECT EXISTS (SELECT 1
                                            FROM information_schema.tables
                                            WHERE table_schema = 'public'
                                              AND table_name = 'migrationversion') as table_exists;`;
    return result[0].table_exists;
}

async function createMigrationTable() {
    await sql`CREATE TABLE migrationVersion
              (
                  version INT PRIMARY KEY
              );`;
    await sql`INSERT INTO migrationVersion (version)
              VALUES (0);`;
}