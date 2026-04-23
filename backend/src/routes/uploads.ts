import { Router } from 'express'
import { getUploadSignature } from '../lib/cloudinary'

const router = Router()

// GET /api/uploads/signature - Get signed signature for Cloudinary upload
router.get('/signature', (req, res) => {
  try {
    const signatureData = getUploadSignature()
    res.json(signatureData)
  } catch (error) {
    res.status(500).json({ message: 'Error generating upload signature' })
  }
})

export default router
