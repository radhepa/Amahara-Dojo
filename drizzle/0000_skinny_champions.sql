CREATE TABLE `training_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`squat` text DEFAULT 'shallow' NOT NULL,
	`reach` text DEFAULT 'shins' NOT NULL,
	`comfort` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `training_records` (
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`minutes` real NOT NULL,
	`day` integer NOT NULL,
	`readiness` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`user_id`, `date`)
);
