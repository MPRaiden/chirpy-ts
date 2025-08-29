"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chirps = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).unique().notNull(),
});
exports.chirps = (0, pg_core_1.pgTable)("chirps", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: (0, pg_core_1.varchar)("body").notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
});
