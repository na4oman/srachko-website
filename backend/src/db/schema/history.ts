import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core'
import { serviceRequests, requestStatusEnum } from './requests'

export const statusHistory = pgTable(
  'status_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id')
      .notNull()
      .references(() => serviceRequests.id, { onDelete: 'cascade' }),
    fromStatus: requestStatusEnum('from_status').notNull(),
    toStatus: requestStatusEnum('to_status').notNull(),
    changedBy: varchar('changed_by', { length: 255 }).notNull(),
    changedAt: timestamp('changed_at').notNull().defaultNow(),
  },
  table => {
    return {
      requestIdIdx: index('idx_history_request_id').on(table.requestId),
    }
  },
)
