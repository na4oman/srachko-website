import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core'

export const requestTypeEnum = pgEnum('request_type', [
  'Ремонт',
  'Монтаж',
  'Профилактика',
  'Запитване за част',
  'Регистрация на уреди',
  'Контакт',
])

export const requestStatusEnum = pgEnum('request_status', [
  'Нова/Получена',
  'Необработена',
  'За проверяване',
  'Отговорено/Потвърдена',
  'В процес',
  'Изчаква части',
  'Завършена',
  'Отказана',
])

export const warrantyStatusEnum = pgEnum('warranty_status', [
  'Да',
  'Не',
  'Не знам',
])

export const serviceRequests = pgTable(
  'service_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    requestType: requestTypeEnum('request_type').notNull(),
    status: requestStatusEnum('status').notNull().default('Нова/Получена'),

    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),

    brand: varchar('brand', { length: 100 }).notNull(),
    model: varchar('model', { length: 100 }).notNull(),
    serialNumber: varchar('serial_number', { length: 100 }),

    city: varchar('city', { length: 100 }),
    district: varchar('district', { length: 100 }),
    street: varchar('street', { length: 200 }),
    streetNumber: varchar('street_number', { length: 20 }),
    block: varchar('block', { length: 20 }),
    entrance: varchar('entrance', { length: 20 }),
    floor: varchar('floor', { length: 20 }),
    apartment: varchar('apartment', { length: 20 }),

    complaint: text('complaint'),
    additionalInfo: text('additional_info'),
    warrantyStatus: warrantyStatusEnum('warranty_status'),
    preferredDate: timestamp('preferred_date'),

    language: varchar('language', { length: 2 }).notNull().default('bg'),
    imageUrls: text('image_urls').array(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => {
    return {
      statusIdx: index('idx_requests_status').on(table.status),
      typeIdx: index('idx_requests_type').on(table.requestType),
      brandIdx: index('idx_requests_brand').on(table.brand),
      createdAtIdx: index('idx_requests_created_at').on(table.createdAt),
      emailIdx: index('idx_requests_email').on(table.email),
    }
  },
)
