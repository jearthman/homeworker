import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { user } from "./user";
import { medications } from "./medication";

export const patient_medications = pgTable("patient_medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => user.id).notNull(),
  medicationId: integer("medication_id").references(() => medications.ndc).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
