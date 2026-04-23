import { Router } from 'express'
import { createRequestSchema } from '../lib/validation'
import { db } from '../db/index'
import { serviceRequests } from '../db/schema/index'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { sendServiceRequestEmail } from '../lib/email'
import { eq } from 'drizzle-orm'

const router = Router()

// POST /api/requests - Create a new service request (Public)
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createRequestSchema.parse(req.body)

    const [newRequest] = await db
      .insert(serviceRequests)
      .values({
        ...validatedData,
      } as any)
      .returning()

    // Send email notification (don't block the response)
    sendServiceRequestEmail(newRequest).catch(err =>
      console.error('Failed to send email:', err),
    )

    res.status(201).json({
      message: 'Service request created successfully',
      data: newRequest,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/requests - List requests (Protected - Admin only)
router.get(
  '/',
  ClerkExpressWithAuth() as any,
  async (req: any, res: any, next: any) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const requests = await db
        .select()
        .from(serviceRequests)
        .orderBy(serviceRequests.createdAt)

      res.setHeader('x-total-count', requests.length.toString())
      res.setHeader('Access-Control-Expose-Headers', 'x-total-count')
      res.json(requests)
    } catch (error) {
      next(error)
    }
  },
)

// GET /api/requests/:id - Get a single request (Protected - Admin only)
router.get(
  '/:id',
  ClerkExpressWithAuth() as any,
  async (req: any, res: any, next: any) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { id } = req.params
      const [request] = await db
        .select()
        .from(serviceRequests)
        .where(eq(serviceRequests.id, id))

      if (!request) {
        return res.status(404).json({ message: 'Request not found' })
      }

      res.json(request)
    } catch (error) {
      next(error)
    }
  },
)

// PATCH /api/requests/:id - Update a request status (Protected - Admin only)
router.patch(
  '/:id',
  ClerkExpressWithAuth() as any,
  async (req: any, res: any, next: any) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { id } = req.params
      const { status } = req.body

      const [updatedRequest] = await db
        .update(serviceRequests)
        .set({ status, updatedAt: new Date() })
        .where(eq(serviceRequests.id, id))
        .returning()

      if (!updatedRequest) {
        return res.status(404).json({ message: 'Request not found' })
      }

      res.json(updatedRequest)
    } catch (error) {
      next(error)
    }
  },
)

export default router
