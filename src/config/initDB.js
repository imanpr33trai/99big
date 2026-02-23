import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connection from "./connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create tables from schema.sql
const createTables = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split by semicolons and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      await connection.execute(statement);
    }
    console.log("✓ All tables created successfully.");
  } catch (error) {
    console.error("✗ Error creating tables:", error.message);
  }
};

// Function to insert seed data from seed.sql
const insertSeedData = async () => {
  try {
    const seedPath = path.join(__dirname, "seed.sql");
    const seed = fs.readFileSync(seedPath, "utf8");

    // Split by semicolons and execute each statement
    const statements = seed.split(";").filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      await connection.execute(statement);
    }
    console.log("✓ Seed data inserted successfully.");
  } catch (error) {
    console.error("✗ Error inserting seed data:", error.message);
  }
};

// Main execution
(async () => {
  console.log("\n=================================");
  console.log("Starting database initialization...");
  console.log("=================================\n");

  // First create all tables
  await createTables();

  // Then insert seed data
  await insertSeedData();

  console.log("\n=================================");
  console.log("✓ Database initialization complete!");
  console.log("=================================");
  console.log("\nYou can now start the server with: yarn start\n");
})();
