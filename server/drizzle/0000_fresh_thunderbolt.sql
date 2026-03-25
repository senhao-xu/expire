CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`expire_date` text NOT NULL,
	`price` real,
	`currency` text DEFAULT 'CNY' NOT NULL,
	`cycle` text,
	`cycle_days` integer,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `renewal_records` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`notes` text,
	`renewed_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE cascade
);
