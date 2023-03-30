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
import { patient } from "./patient";
import { medications } from "./medication";

export const patient_medications = pgTable("patient_medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .references(() => patient.id)
    .notNull(),
  medicationId: integer("medication_id")
    .references(() => medications.ndc)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
