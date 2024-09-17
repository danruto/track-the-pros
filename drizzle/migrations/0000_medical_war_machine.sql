CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`riot_id` text NOT NULL,
	`player_id` integer,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` integer PRIMARY KEY NOT NULL,
	`display` text NOT NULL,
	`role` text NOT NULL,
	`avatar` text,
	`team_id` integer,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_id_unique` ON `accounts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `players_id_unique` ON `players` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_id_unique` ON `teams` (`id`);