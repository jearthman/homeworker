import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: text("email").notNull(),
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  age: integer("age").notNull(),
  medHistory: text("med_history").notNull(),
});

export type patient = InferModel<typeof patient>;
export type Newpatient = InferModel<typeof patient, "insert">;
