CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book` text NOT NULL,
	`episode_number` integer,
	`episode_title` text NOT NULL,
	`actor` text NOT NULL,
	`character` text,
	`author` text NOT NULL,
	`quote` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_quotes_actor` ON `quotes` (`actor`);--> statement-breakpoint
CREATE INDEX `idx_quotes_book` ON `quotes` (`book`);