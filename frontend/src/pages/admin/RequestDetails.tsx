import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Wrench,
  AlertCircle,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ServiceRequest {
  id: string
  requestType: string
  status: string
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  model: string
  serialNumber?: string
  city?: string
  district?: string
  street?: string
  streetNumber?: string
  complaint?: string
  additionalInfo?: string
  warrantyStatus?: string
  createdAt: string
  imageUrls?: string[]
}

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchRequest = useCallback(async () => {
    try {
      const token = await getToken()
      const response = await axios.get(`${API_URL}/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRequest(response.data)
    } catch (error) {
      console.error('Error fetching request details:', error)
    } finally {
      setLoading(false)
    }
  }, [id, getToken])

  useEffect(() => {
    fetchRequest()
  }, [fetchRequest])

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true)
      const token = await getToken()
      await axios.patch(
        `${API_URL}/requests/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      await fetchRequest()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className='p-8 text-center'>
        <h2 className='text-2xl font-bold'>Заявката не е намерена</h2>
        <Button onClick={() => navigate('/admin/requests')} className='mt-4'>
          Назад към списъка
        </Button>
      </div>
    )
  }

  return (
    <div className='p-8 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' /> Назад
        </Button>
        <div className='flex items-center gap-4'>
          {updating && (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
          )}
          <Select
            disabled={updating}
            value={request.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Промени статус' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Нова/Получена'>Нова/Получена</SelectItem>
              <SelectItem value='Необработена'>Необработена</SelectItem>
              <SelectItem value='За проверяване'>За проверяване</SelectItem>
              <SelectItem value='Отговорено/Потвърдена'>
                Отговорено/Потвърдена
              </SelectItem>
              <SelectItem value='В процес'>В процес</SelectItem>
              <SelectItem value='Изчаква части'>Изчаква части</SelectItem>
              <SelectItem value='Завършена'>Завършена</SelectItem>
              <SelectItem value='Отказана'>Отказана</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-2xl'>
                    {request.requestType} - {request.brand} {request.model}
                  </CardTitle>
                  <CardDescription>ID: {request.id}</CardDescription>
                </div>
                <Badge
                  className={`${
                    request.status === 'Нова/Получена' ||
                    request.status === 'За проверяване'
                      ? 'bg-orange-100 text-orange-800'
                      : request.status === 'В процес' ||
                          request.status === 'Изчаква части'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='font-semibold flex items-center gap-2 mb-2'>
                  <AlertCircle className='h-4 w-4 text-primary' /> Описание на
                  проблема
                </h3>
                <p className='text-gray-700 bg-gray-50 p-4 rounded-lg border'>
                  {request.complaint || 'Няма предоставено описание.'}
                </p>
              </div>

              {request.additionalInfo && (
                <div>
                  <h3 className='font-semibold mb-2'>
                    Допълнителна информация
                  </h3>
                  <p className='text-gray-600'>{request.additionalInfo}</p>
                </div>
              )}

              {request.imageUrls && request.imageUrls.length > 0 && (
                <div>
                  <h3 className='font-semibold mb-3'>Снимки</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    {request.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Request image ${index + 1}`}
                        className='rounded-lg border object-cover w-full h-48'
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Клиент</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-blue-50 p-2 rounded-md'>
                  <Wrench className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    {request.firstName} {request.lastName}
                  </div>
                  <div className='text-xs text-muted-foreground'>Име</div>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='bg-green-50 p-2 rounded-md'>
                  <Phone className='h-4 w-4 text-green-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>{request.phone}</div>
                  <div className='text-xs text-muted-foreground'>Телефон</div>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='bg-purple-50 p-2 rounded-md'>
                  <Mail className='h-4 w-4 text-purple-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>{request.email}</div>
                  <div className='text-xs text-muted-foreground'>Имейл</div>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='bg-orange-50 p-2 rounded-md'>
                  <MapPin className='h-4 w-4 text-orange-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    {request.city}
                    {request.district && `, ${request.district}`}
                    {request.street && `, ${request.street}`}
                    {request.streetNumber && ` ${request.streetNumber}`}
                  </div>
                  <div className='text-xs text-muted-foreground'>Адрес</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Детайли за уреда</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Марка:</span>
                <span className='font-medium'>{request.brand}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Модел:</span>
                <span className='font-medium'>{request.model}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Сериен №:</span>
                <span className='font-medium'>
                  {request.serialNumber || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Гаранция:</span>
                <Badge variant='outline'>
                  {request.warrantyStatus || 'N/A'}
                </Badge>
              </div>
              <div className='flex justify-between text-sm pt-4 border-t'>
                <span className='text-muted-foreground'>Създадена на:</span>
                <span className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {new Date(request.createdAt).toLocaleDateString('bg-BG')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RequestDetails
