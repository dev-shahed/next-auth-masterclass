import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./usersSchema";

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  //If the user is deleted the password token will be deleted to
  userId: integer("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .unique(),
  token: text("token"),
  tokenExpiry: timestamp("token_expiry"),
});
