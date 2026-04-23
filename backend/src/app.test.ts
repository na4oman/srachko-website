import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import app from './index'
import * as fc from 'fast-check'
import { db } from './db/index'

// Mock the database
vi.mock('./db/index', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'test-uuid', requestType: 'Ремонт' }]),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
  },
}))

// Mock email service
vi.mock('./lib/email', () => ({
  sendServiceRequestEmail: vi.fn().mockResolvedValue(undefined),
}))

// Mock Clerk middleware
vi.mock('@clerk/clerk-sdk-node', () => ({
  ClerkExpressWithAuth: () => (req: any, res: any, next: any) => {
    req.auth = { userId: 'test-user' }
    next()
  },
}))

describe('API Property Tests', () => {
  describe('POST /api/requests', () => {
    it('should return 400 for invalid request bodies', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            firstName: fc.string({ maxLength: 1 }), // Invalid
            requestType: fc.constant('Ремонт' as const),
          }, { requiredKeys: ['firstName', 'requestType'] }),
          async (body) => {
            const response = await request(app)
              .post('/api/requests')
              .send(body)
            
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message', 'Validation Error')
            expect(response.body).toHaveProperty('errors')
          }
        )
      )
    })

    it('should return 201 and a unique ID for valid requests', async () => {
      const validBody = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        phone: '0888123456',
        brand: 'Bosch',
        model: 'WGG14400BY',
        language: 'bg',
        city: 'София',
        street: 'Улица',
        streetNumber: '1',
        requestType: 'Ремонт',
        serialNumber: '12345',
        complaint: 'Не работи уреда, моля помогнете',
        warrantyStatus: 'Да',
      }

      const response = await request(app)
        .post('/api/requests')
        .send(validBody)
      
      expect(response.status).toBe(201)
      expect(response.body.data).toHaveProperty('id', 'test-uuid')
    })
  })

  describe('Error Handling Properties', () => {
    it('should not expose stack traces in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      // Force an error by sending something that will fail validation
      const response = await request(app)
        .post('/api/requests')
        .send({})
      
      expect(response.body).not.toHaveProperty('stack')
      
      process.env.NODE_ENV = originalEnv
    })

    it('should include user-friendly messages in error responses', async () => {
      const response = await request(app)
        .post('/api/requests')
        .send({ requestType: 'Ремонт' }) // Missing required fields
      
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Validation Error')
      expect(Array.isArray(response.body.errors)).toBe(true)
    })
  })
})
