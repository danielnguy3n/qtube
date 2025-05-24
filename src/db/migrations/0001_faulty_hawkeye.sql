ALTER TABLE "playlistItems" RENAME TO "playlist_items";--> statement-breakpoint
ALTER TABLE "playlist_items" DROP CONSTRAINT "playlistItems_playlist_id_playlists_id_fk";
--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "channel" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "title" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "views" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "published_at" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "url" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "timestamp" integer[] NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD COLUMN "duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_items" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "playlist_items" DROP COLUMN "end_time";--> statement-breakpoint
ALTER TABLE "playlist_items" DROP COLUMN "created_at";