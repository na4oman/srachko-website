import { z } from 'zod'

// Shared base schema for all request types
export const baseRequestSchema = z.object({
  firstName: z.string().trim().min(2, 'Минимум 2 символа').max(100),
  lastName: z.string().trim().min(2, 'Минимум 2 символа').max(100),
  email: z.string().trim().email('Невалиден имейл адрес'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s()-]{7,20}$/, 'Невалиден телефонен номер'),
  brand: z.string().trim().min(1, 'Изберете марка'),
  model: z.string().trim().min(1, 'Въведете модел'),
  language: z.enum(['bg', 'en']).default('bg'),
})

// Address validation schema
export const addressSchema = z.object({
  city: z.string().trim().min(1, 'Въведете град'),
  street: z.string().trim().min(1, 'Въведете улица'),
  streetNumber: z.string().trim().min(1, 'Въведете номер'),
  district: z.string().trim().optional(),
  block: z.string().trim().optional(),
  entrance: z.string().trim().optional(),
  floor: z.string().trim().optional(),
  apartment: z.string().trim().optional(),
})

// Repair request schema
export const repairRequestSchema = baseRequestSchema
  .merge(addressSchema)
  .extend({
    requestType: z.literal('Ремонт'),
    serialNumber: z.string().trim().min(1, 'Въведете сериен номер'),
    complaint: z
      .string()
      .trim()
      .min(10, 'Опишете проблема (минимум 10 символа)'),
    warrantyStatus: z.enum(['Да', 'Не', 'Не знам']),
    preferredDate: z.string().optional(), // Store as string for flexibility
    additionalInfo: z.string().trim().optional(),
    imageUrls: z.array(z.string().url()).optional(),
  })

// Installation request schema
export const installationRequestSchema = baseRequestSchema
  .merge(addressSchema)
  .extend({
    requestType: z.literal('Монтаж'),
    serialNumber: z.string().trim().optional(),
    complaint: z
      .string()
      .trim()
      .min(10, 'Опишете нуждите (минимум 10 символа)'),
    preferredDate: z.string().optional(),
    additionalInfo: z.string().trim().optional(),
  })

// Maintenance request schema
export const maintenanceRequestSchema = baseRequestSchema
  .merge(addressSchema)
  .extend({
    requestType: z.literal('Профилактика'),
    serialNumber: z.string().trim().optional(),
    complaint: z.string().trim().optional(),
    preferredDate: z.string().optional(),
    additionalInfo: z.string().trim().optional(),
  })

// Parts Inquiry request schema
export const partsInquiryRequestSchema = baseRequestSchema
  .merge(addressSchema)
  .extend({
    requestType: z.literal('Запитване за част'),
    serialNumber: z.string().trim().optional(),
    complaint: z.string().trim().min(5, 'Опишете коя част търсите'),
    additionalInfo: z.string().trim().optional(),
    imageUrls: z.array(z.string().url()).optional(),
  })

// Device Registration request schema
export const deviceRegistrationRequestSchema = baseRequestSchema
  .merge(addressSchema)
  .extend({
    requestType: z.literal('Регистрация на уреди'),
    serialNumber: z.string().trim().min(1, 'Въведете сериен номер'),
    complaint: z.string().trim().optional(),
    additionalInfo: z.string().trim().optional(),
  })

// Contact form schema
export const contactRequestSchema = baseRequestSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    language: true,
  })
  .extend({
    requestType: z.literal('Контакт'),
    message: z
      .string()
      .trim()
      .min(10, 'Съобщението трябва да е поне 10 символа'),
  })

// Unified request schema using discriminated union
export const createRequestSchema = z.discriminatedUnion('requestType', [
  repairRequestSchema,
  installationRequestSchema,
  maintenanceRequestSchema,
  partsInquiryRequestSchema,
  deviceRegistrationRequestSchema,
  contactRequestSchema,
])

export type CreateRequestInput = z.infer<typeof createRequestSchema>
