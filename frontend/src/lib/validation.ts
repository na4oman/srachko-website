import { z } from 'zod';

// Shared base schema for all request types
export const baseRequestSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа').max(100),
  lastName: z.string().min(2, 'Минимум 2 символа').max(100),
  email: z.string().email('Невалиден имейл адрес'),
  phone: z.string().regex(/^[0-9+\s()-]{7,20}$/, 'Невалиден телефонен номер'),
  brand: z.string().min(1, 'Изберете марка'),
  model: z.string().min(1, 'Въведете модел'),
  language: z.enum(['bg', 'en']).default('bg'),
});

// Address validation schema
export const addressSchema = z.object({
  city: z.string().min(1, 'Въведете град'),
  street: z.string().min(1, 'Въведете улица'),
  streetNumber: z.string().min(1, 'Въведете номер'),
  district: z.string().optional(),
  block: z.string().optional(),
  entrance: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
});

// Repair request schema
export const repairRequestSchema = baseRequestSchema.merge(addressSchema).extend({
  requestType: z.literal('Ремонт'),
  serialNumber: z.string().min(1, 'Въведете сериен номер'),
  complaint: z.string().min(10, 'Опишете проблема (минимум 10 символа)'),
  warrantyStatus: z.enum(['Да', 'Не', 'Не знам']),
  preferredDate: z.string().optional(), // Using string for date input in frontend
  additionalInfo: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

// Installation request schema
export const installationRequestSchema = baseRequestSchema.merge(addressSchema).extend({
  requestType: z.literal('Монтаж'),
  serialNumber: z.string().optional(),
  complaint: z.string().min(10, 'Опишете нуждите (минимум 10 символа)'),
  preferredDate: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Maintenance request schema
export const maintenanceRequestSchema = baseRequestSchema.merge(addressSchema).extend({
  requestType: z.literal('Профилактика'),
  serialNumber: z.string().optional(),
  complaint: z.string().optional(),
  preferredDate: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Parts Inquiry request schema
export const partsInquiryRequestSchema = baseRequestSchema.merge(addressSchema).extend({
  requestType: z.literal('Запитване за част'),
  serialNumber: z.string().optional(),
  complaint: z.string().min(5, 'Опишете коя част търсите'),
  additionalInfo: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

// Device Registration request schema
export const deviceRegistrationRequestSchema = baseRequestSchema.merge(addressSchema).extend({
  requestType: z.literal('Регистрация на уреди'),
  serialNumber: z.string().min(1, 'Въведете сериен номер'),
  complaint: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Contact form schema
export const contactRequestSchema = baseRequestSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  language: true,
}).extend({
  requestType: z.literal('Контакт'),
  message: z.string().min(10, 'Съобщението трябва да е поне 10 символа'),
});

// Unified request schema using discriminated union
export const createRequestSchema = z.discriminatedUnion('requestType', [
  repairRequestSchema,
  installationRequestSchema,
  maintenanceRequestSchema,
  partsInquiryRequestSchema,
  deviceRegistrationRequestSchema,
  contactRequestSchema,
]);

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const REQUEST_TYPES = [
  'Ремонт',
  'Монтаж',
  'Профилактика',
  'Запитване за част',
  'Регистрация на уреди',
  'Контакт'
] as const;

export type RequestType = typeof REQUEST_TYPES[number];
