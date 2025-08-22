"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
const better_sqlite3_2 = __importDefault(require("better-sqlite3"));
const env_1 = require("../config/env");
const sqlite = new better_sqlite3_2.default(env_1.env.DB_URL.replace('file:', ''));
exports.db = (0, better_sqlite3_1.drizzle)(sqlite);
//# sourceMappingURL=drizzle.js.map