ALTER TABLE `quotes` ADD `quote_normalized` text NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_quotes_quote_normalized` ON `quotes` (`quote_normalized`);