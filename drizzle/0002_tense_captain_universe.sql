CREATE TABLE `dojo_accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`mutation_id` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dojo_reward_events` (
	`user_id` text NOT NULL,
	`source_id` text NOT NULL,
	`awarded_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `source_id`)
);
