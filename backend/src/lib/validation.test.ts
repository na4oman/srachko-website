import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { createRequestSchema, addressSchema } from './validation'

describe('Validation Schemas Property Tests', () => {
  // Realistic phone number arbitrary
  const phoneArb = fc
    .array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), {
      minLength: 7,
      maxLength: 15,
    })
    .map(arr => `08${arr.join('').slice(0, 8)}`) // Ensure it looks like a BG mobile number

  // Arbitrary for base request fields
  const baseRequestArb = {
    firstName: fc
      .string({ minLength: 2, maxLength: 100 })
      .filter(s => s.trim().length >= 2),
    lastName: fc
      .string({ minLength: 2, maxLength: 100 })
      .filter(s => s.trim().length >= 2),
    email: fc.constant('test@example.com'),
    phone: phoneArb,
    brand: fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    model: fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    language: fc.constantFrom('bg' as const, 'en' as const),
  }

  // Arbitrary for address fields
  const addressArb = {
    city: fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    street: fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    streetNumber: fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    district: fc.option(fc.string(), { nil: undefined }),
    block: fc.option(fc.string(), { nil: undefined }),
    entrance: fc.option(fc.string(), { nil: undefined }),
    floor: fc.option(fc.string(), { nil: undefined }),
    apartment: fc.option(fc.string(), { nil: undefined }),
  }

  it('should validate any valid Repair request', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          requestType: fc.constant('Ремонт' as const),
          serialNumber: fc
            .string({ minLength: 1 })
            .filter(s => s.trim().length >= 1),
          complaint: fc
            .string({ minLength: 10 })
            .filter(s => s.trim().length >= 10),
          warrantyStatus: fc.constantFrom(
            'Да' as const,
            'Не' as const,
            'Не знам' as const,
          ),
          preferredDate: fc.option(
            fc.date().map(d => d.toISOString()),
            { nil: undefined },
          ),
          additionalInfo: fc.option(fc.string(), { nil: undefined }),
          imageUrls: fc.option(fc.array(fc.webUrl()), { nil: undefined }),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should validate any valid Installation request', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          requestType: fc.constant('Монтаж' as const),
          serialNumber: fc.option(fc.string(), { nil: undefined }),
          complaint: fc
            .string({ minLength: 10 })
            .filter(s => s.trim().length >= 10),
          preferredDate: fc.option(
            fc.date().map(d => d.toISOString()),
            { nil: undefined },
          ),
          additionalInfo: fc.option(fc.string(), { nil: undefined }),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should validate any valid Maintenance request', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          requestType: fc.constant('Профилактика' as const),
          serialNumber: fc.option(fc.string(), { nil: undefined }),
          complaint: fc.option(fc.string(), { nil: undefined }),
          preferredDate: fc.option(
            fc.date().map(d => d.toISOString()),
            { nil: undefined },
          ),
          additionalInfo: fc.option(fc.string(), { nil: undefined }),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should validate any valid Parts Inquiry request', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          requestType: fc.constant('Запитване за част' as const),
          serialNumber: fc.option(fc.string(), { nil: undefined }),
          complaint: fc
            .string({ minLength: 5 })
            .filter(s => s.trim().length >= 5),
          additionalInfo: fc.option(fc.string(), { nil: undefined }),
          imageUrls: fc.option(fc.array(fc.webUrl()), { nil: undefined }),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should validate any valid Device Registration request', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          requestType: fc.constant('Регистрация на уреди' as const),
          serialNumber: fc
            .string({ minLength: 1 })
            .filter(s => s.trim().length >= 1),
          complaint: fc.option(fc.string(), { nil: undefined }),
          additionalInfo: fc.option(fc.string(), { nil: undefined }),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should validate any valid Contact request', () => {
    fc.assert(
      fc.property(
        fc.record({
          firstName: baseRequestArb.firstName,
          lastName: baseRequestArb.lastName,
          email: baseRequestArb.email,
          phone: baseRequestArb.phone,
          language: baseRequestArb.language,
          requestType: fc.constant('Контакт' as const),
          message: fc
            .string({ minLength: 10 })
            .filter(s => s.trim().length >= 10),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return result.success
        },
      ),
    )
  })

  it('should invalidate requests with too short names', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          firstName: fc.string({ maxLength: 1 }), // Invalid length
          requestType: fc.constant('Ремонт' as const),
          serialNumber: fc.string({ minLength: 1 }),
          complaint: fc.string({ minLength: 10 }),
          warrantyStatus: fc.constantFrom(
            'Да' as const,
            'Не' as const,
            'Не знам' as const,
          ),
        }),
        data => {
          const result = createRequestSchema.safeParse(data)
          return !result.success
        },
      ),
    )
  })

  it('should invalidate requests with invalid emails', () => {
    fc.assert(
      fc.property(
        fc.record({
          ...baseRequestArb,
          ...addressArb,
          email: fc.string().filter(s => !s.includes('@')), // Likely invalid email
          requestType: fc.constant('Ремонт' as const),
          serialNumber: fc.string({ minLength: 1 }),
          complaint: fc.string({ minLength: 10 }),
          warrantyStatus: fc.constantFrom(
            'Да' as const,
            'Не' as const,
            'Не знам' as const,
          ),
        }),
        data => {
          // Some strings without @ might still be considered valid by some parsers,
          // but Zod is strict. If it's an empty string it's also invalid.
          const result = createRequestSchema.safeParse(data)
          return !result.success || data.email.includes('@')
        },
      ),
    )
  })

  describe('Address Validation Properties', () => {
    it('should validate any valid address', () => {
      fc.assert(
        fc.property(fc.record(addressArb), data => {
          const result = addressSchema.safeParse(data)
          return result.success
        }),
      )
    })

    it('should reject addresses with missing required fields', () => {
      const requiredFields = ['city', 'street', 'streetNumber']

      requiredFields.forEach(field => {
        fc.assert(
          fc.property(
            fc
              .record({
                city: fc.string({ minLength: 1 }),
                street: fc.string({ minLength: 1 }),
                streetNumber: fc.string({ minLength: 1 }),
              })
              .map(addr => {
                const newAddr = { ...addr } as any
                delete newAddr[field]
                return newAddr
              }),
            data => {
              const result = addressSchema.safeParse(data)
              return !result.success
            },
          ),
        )
      })
    })
  })
})
