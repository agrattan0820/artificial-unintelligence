"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
// Load .env file before importing db
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const migrationDB = (0, node_postgres_1.drizzle)(pool);
function runDatabaseMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, migrator_1.migrate)(migrationDB, { migrationsFolder: "./drizzle" });
            console.log("Migration completed! ✅");
        }
        catch (error) {
            console.error("Migration failed! ❌");
            console.error(error);
        }
    });
}
runDatabaseMigrations();
