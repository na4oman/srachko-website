import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createRequest = async (data: any) => {
  const response = await api.post('/requests', data)
  return response.data
}

export const getUploadSignature = async () => {
  const response = await api.get('/uploads/signature')
  return response.data
}

export const uploadToCloudinary = async (file: File) => {
  const signatureData = await getUploadSignature()
  const { timestamp, signature, apiKey, cloudName } = signatureData

  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('api_key', apiKey)
  formData.append('folder', 'srachko-service')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const result = await response.json()
  return result.secure_url
}

export default api
