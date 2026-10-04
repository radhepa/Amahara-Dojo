import { sqliteTable, text, real, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const records = sqliteTable("training_records", {
 userId:text("user_id").notNull(),date:text("date").notNull(),kind:text("kind").notNull(),minutes:real("minutes").notNull(),day:integer("day").notNull(),readiness:text("readiness").notNull(),note:text("note").notNull().default(""),
},t=>[primaryKey({columns:[t.userId,t.date]})]);
export const profiles = sqliteTable("training_profiles", {
 userId:text("user_id").primaryKey(),squat:text("squat").notNull().default("shallow"),reach:text("reach").notNull().default("shins"),comfort:integer("comfort",{mode:"boolean"}).notNull().default(false),
});

export const weekChecks=sqliteTable("beginner_week_checks",{userId:text("user_id").notNull(),week:integer("week").notNull(),goals:text("goals").notNull()},t=>[primaryKey({columns:[t.userId,t.week]})]);

export const dojoAccounts=sqliteTable("dojo_accounts",{userId:text("user_id").primaryKey(),state:text("state").notNull(),revision:integer("revision").notNull().default(0),mutationId:text("mutation_id").notNull().default("")});
export const dojoRewardEvents=sqliteTable("dojo_reward_events",{userId:text("user_id").notNull(),sourceId:text("source_id").notNull(),awardedAt:integer("awarded_at").notNull()},t=>[primaryKey({columns:[t.userId,t.sourceId]})]);
