import type { RequestHandler } from "@builder.io/qwik-city";
import { sql } from "drizzle-orm";
import { db } from "~/lib/db/drizzle";
import { users } from "~/lib/db/schema";

export const onGet: RequestHandler = async (event) => {
  const dbIsUp =
    (await db
      .select({ count: sql<number>`count(id)`.mapWith(Number) })
      .from(users)
      .get()?.count) || -1;

  event.json(dbIsUp >= 0 ? 200 : 419, {
    server: "up",
    database: dbIsUp >= 0 ? "up" : "down",
  });
};
