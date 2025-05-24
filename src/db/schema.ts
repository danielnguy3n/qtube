import {
    pgTable,
    serial,
    varchar,
    // boolean,
    timestamp,
    integer,
    text,
    primaryKey,
    boolean,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)

export const playlists = pgTable("playlists", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    name: varchar("name").notNull(),
    description: varchar("description").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
})

export const playlistItems = pgTable("playlist_items", {
    id: serial("id").primaryKey(),
    playlistId: integer("playlist_id")
        .notNull()
        .references(() => playlists.id),
    videoId: varchar("video_id").notNull(),
    channel: varchar("channel").notNull(),
    title: varchar("title").notNull(),
    views: varchar("views").notNull(),
    publishedAt: varchar("published_at").notNull(),
    url: varchar("url").notNull(),
    thumbnailUrl: varchar("thumbnail_url").notNull(),
    timestamp: integer("timestamp").array().notNull(),
    itemName: varchar("name").notNull(),
    position: integer("position").notNull(),
    duration: integer("duration").notNull(),
})

// Create relations
export const usersRelations = relations(users, ({ many }) => ({
    playlists: many(playlists),
}))

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
    user: one(users, {
        fields: [playlists.userId],
        references: [users.id],
    }),
    items: many(playlistItems),
}))

export const playlistItemsRelations = relations(playlistItems, ({ one }) => ({
    playlists: one(playlists, {
        fields: [playlistItems.playlistId],
        references: [playlists.id],
    }),
}))
