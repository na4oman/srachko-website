import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { X, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ServiceRequest {
  id: string
  requestType: string
  firstName: string
  lastName: string
  status: string
  brand: string
  model: string
  city?: string
  district?: string
  street?: string
  streetNumber?: string
  createdAt: string
}

export const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const statusFilter = searchParams.get('status')
  const typeFilter = searchParams.get('type')
  const brandFilter = searchParams.get('brand')
  const dateFilter = searchParams.get('date')
  const searchQuery = searchParams.get('search')
  const sortKey = searchParams.get('sort') || 'createdAt'
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await getToken()
        const response = await axios.get(`${API_URL}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setRequests(response.data)
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [getToken])

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(requests.map(r => r.requestType))).sort()
  }, [requests])

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(requests.map(r => r.brand))).sort()
  }, [requests])

  const filteredRequests = useMemo(() => {
    const result = requests.filter(request => {
      // Status Filter
      if (statusFilter) {
        if (statusFilter === 'pending') {
          if (
            !(
              request.status === 'Нова/Получена' ||
              request.status === 'За проверяване'
            )
          )
            return false
        } else if (statusFilter === 'in_progress') {
          if (
            !(
              request.status === 'В процес' ||
              request.status === 'Изчаква части'
            )
          )
            return false
        } else if (statusFilter === 'completed') {
          if (request.status !== 'Завършена') return false
        }
      }

      // Type Filter
      if (typeFilter && request.requestType !== typeFilter) return false

      // Brand Filter
      if (brandFilter && request.brand !== brandFilter) return false

      // Date Filter
      if (dateFilter) {
        const requestDate = new Date(request.createdAt)
          .toISOString()
          .split('T')[0]
        if (requestDate !== dateFilter) return false
      }

      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const fullName =
          `${request.firstName} ${request.lastName}`.toLowerCase()
        const fullAddress =
          `${request.city || ''} ${request.district || ''} ${request.street || ''}`.toLowerCase()
        const brandModel = `${request.brand} ${request.model}`.toLowerCase()

        if (
          !fullName.includes(query) &&
          !fullAddress.includes(query) &&
          !brandModel.includes(query) &&
          !request.requestType.toLowerCase().includes(query) &&
          !request.status.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      return true
    })

    // Sorting
    return [...result].sort((a, b) => {
      if (sortKey === 'name') {
        const aName = `${a.firstName} ${a.lastName}`
        const bName = `${b.firstName} ${b.lastName}`
        return sortOrder === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName)
      }

      const key = sortKey as keyof ServiceRequest
      const aVal = a[key] ?? ''
      const bVal = b[key] ?? ''

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [
    requests,
    statusFilter,
    typeFilter,
    brandFilter,
    dateFilter,
    searchQuery,
    sortKey,
    sortOrder,
  ])

  const toggleSort = (key: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (sortKey === key) {
      newParams.set('order', sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      newParams.set('sort', key)
      newParams.set('order', 'asc')
    }
    setSearchParams(newParams)
  }

  const SortIcon = ({ k }: { k: string }) => {
    if (sortKey !== k) return <ArrowUpDown className='ml-2 h-4 w-4' />
    return sortOrder === 'asc' ? (
      <ArrowUp className='ml-2 h-4 w-4' />
    ) : (
      <ArrowDown className='ml-2 h-4 w-4' />
    )
  }

  const updateFilter = (key: string, value: string | undefined | null) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilter = () => {
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  const hasAnyFilter =
    statusFilter || typeFilter || brandFilter || dateFilter || searchQuery

  return (
    <div className='p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Заявки</h2>
        {hasAnyFilter && (
          <Button
            variant='outline'
            size='sm'
            onClick={clearFilter}
            className='flex items-center gap-2'
          >
            Изчисти филтрите <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      <Card className='p-4 space-y-4'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Търсене по име, адрес, марка, модел...'
            className='pl-8 w-full'
            value={searchQuery || ''}
            onChange={e => updateFilter('search', e.target.value)}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Статус</label>
            <Select
              value={statusFilter || 'all'}
              onValueChange={(v: string) => updateFilter('status', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Всички статуси' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Всички статуси</SelectItem>
                <SelectItem value='pending'>Изчакващи</SelectItem>
                <SelectItem value='in_progress'>В процес</SelectItem>
                <SelectItem value='completed'>Завършени</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Тип заявка</label>
            <Select
              value={typeFilter || 'all'}
              onValueChange={(v: string) => updateFilter('type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Всички типове' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Всички типове</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Марка</label>
            <Select
              value={brandFilter || 'all'}
              onValueChange={(v: string) => updateFilter('brand', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Всички марки' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Всички марки</SelectItem>
                {uniqueBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Дата на заявка</label>
            <Input
              type='date'
              value={dateFilter || ''}
              onChange={e => updateFilter('date', e.target.value)}
              className='w-full'
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle>Списък със заявки</CardTitle>
          <div className='text-sm text-muted-foreground'>
            Намерени: {filteredRequests.length}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className='cursor-pointer hover:text-primary transition-colors'
                  onClick={() => toggleSort('name')}
                >
                  <div className='flex items-center'>
                    Клиент <SortIcon k='name' />
                  </div>
                </TableHead>
                <TableHead
                  className='cursor-pointer hover:text-primary transition-colors'
                  onClick={() => toggleSort('requestType')}
                >
                  <div className='flex items-center'>
                    Тип <SortIcon k='requestType' />
                  </div>
                </TableHead>
                <TableHead
                  className='cursor-pointer hover:text-primary transition-colors'
                  onClick={() => toggleSort('brand')}
                >
                  <div className='flex items-center'>
                    Марка <SortIcon k='brand' />
                  </div>
                </TableHead>
                <TableHead
                  className='cursor-pointer hover:text-primary transition-colors'
                  onClick={() => toggleSort('status')}
                >
                  <div className='flex items-center'>
                    Статус <SortIcon k='status' />
                  </div>
                </TableHead>
                <TableHead
                  className='text-right cursor-pointer hover:text-primary transition-colors'
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className='flex items-center justify-end'>
                    Дата <SortIcon k='createdAt' />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => (
                <TableRow
                  key={request.id}
                  className='cursor-pointer hover:bg-slate-50'
                  onClick={() => navigate(`/admin/requests/${request.id}`)}
                >
                  <TableCell className='font-medium'>
                    {request.firstName} {request.lastName}
                  </TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>{request.brand}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    {new Date(request.createdAt).toLocaleDateString('bg-BG')}
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-10 text-muted-foreground'
                  >
                    Няма намерени заявки.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestList
