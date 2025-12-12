"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// Carregar variáveis de ambiente da mesma forma que o server.ts
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env.local') });
dotenv_1.default.config();
console.log('Checking environment variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
if (process.env.DATABASE_URL) {
    var protocol = process.env.DATABASE_URL.split(':')[0];
    console.log('DATABASE_URL Protocol:', protocol);
}
if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is missing!');
}
