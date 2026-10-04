CREATE TABLE `beginner_week_checks` (
	`user_id` text NOT NULL,
	`week` integer NOT NULL,
	`goals` text NOT NULL,
	PRIMARY KEY(`user_id`, `week`)
);
