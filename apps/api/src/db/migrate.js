import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const migrationUrl = new URL('../../migrations/001_initial_schema.sql', import.meta.url);
const sql = await readFile(fileURLToPath(migrationUrl), 'utf8');
await pool.query(sql);
await pool.end();
console.log('Database migration completed.');
