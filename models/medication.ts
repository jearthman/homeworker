import { integer, pgTable, serial, text, timestamp, varchar, decimal } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const medications = pgTable('medications', {
  ndc: varchar('ndc', { length: 13 }).notNull(),
  name: text('name').notNull(),
  dosageValue: decimal('dosage_value', { precision: 10, scale: 2 }).notNull(),
  dosageUnit: text('dosage_unit').notNull(),
  diagnosis: text('diagnosis'). notNull(),
  form: text('form').notNull(),
  route: text('route').notNull(),
  instructions: text('instructions').notNull(),
  frequency: text('frequency').notNull(),
  duration: text('duration').notNull(),
});

export type Medication = InferModel<typeof medications>;
export type NewMedication= InferModel<typeof medications, 'insert'>;