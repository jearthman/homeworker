import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const users = pgTable('users',{
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: varchar('phone', {length: 20}).notNull(),
  
});