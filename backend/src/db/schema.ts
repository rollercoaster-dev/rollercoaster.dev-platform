import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

// Badges table definition
export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  content: text('content'),
  progress: integer('progress').notNull().default(0),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  startDate: text('start_date'),
  targetDate: text('target_date'),
  externalId: text('external_id'),
  externalSource: text('external_source')
})

// Badge requirements table definition
export const badgeRequirements = pgTable('badge_requirements', {
  id: text('id').primaryKey(),
  badgeId: text('badge_id')
    .notNull()
    .references(() => badges.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})