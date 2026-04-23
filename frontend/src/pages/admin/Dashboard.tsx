import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ServiceRequest {
  id: string
  requestType: string
  firstName: string
  lastName: string
  status: string
  createdAt: string
}

const Dashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const navigate = useNavigate()

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

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  // Calculate statistics
  const totalRequests = requests.length
  const pendingRequests = requests.filter(
    r => r.status === 'Нова/Получена' || r.status === 'За проверяване',
  ).length
  const inProgressRequests = requests.filter(
    r => r.status === 'В процес' || r.status === 'Изчаква части',
  ).length
  const completedRequests = requests.filter(
    r => r.status === 'Завършена',
  ).length

  // Recent requests (last 5)
  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  const stats = [
    {
      title: 'Общо заявки',
      value: totalRequests,
      description: 'Всички получени заявки',
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      link: '/admin/requests',
    },
    {
      title: 'Изчакващи',
      value: pendingRequests,
      description: 'Нови заявки за обработка',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      link: '/admin/requests?status=pending',
    },
    {
      title: 'В процес',
      value: inProgressRequests,
      description: 'Текущи ремонти',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      link: '/admin/requests?status=in_progress',
    },
    {
      title: 'Завършени',
      value: completedRequests,
      description: 'Приключени поръчки',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
      link: '/admin/requests?status=completed',
    },
  ]

  return (
    <div className='p-8 space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Табло за управление
        </h2>
        <p className='text-muted-foreground'>
          Преглед на дейността и последните заявки.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, idx) => (
          <Link key={idx} to={stat.link}>
            <Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-xs text-muted-foreground'>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Последни заявки</CardTitle>
            <CardDescription>
              Имате {pendingRequests} нови заявки за преглед.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className='text-right'>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map(request => (
                  <TableRow
                    key={request.id}
                    className='cursor-pointer hover:bg-slate-50'
                    onClick={() => navigate(`/admin/requests/${request.id}`)}
                  >
                    <TableCell>
                      <div className='font-medium'>
                        {request.firstName} {request.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{request.requestType}</TableCell>
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
                {recentRequests.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-6 text-muted-foreground'
                    >
                      Няма скорошни заявки.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Бързи действия</CardTitle>
            <CardDescription>Често използвани инструменти</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-2'>
              <Link
                to='/admin/requests'
                className='flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors'
              >
                <div className='bg-blue-100 p-2 rounded-md'>
                  <ClipboardList className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Всички заявки</div>
                  <div className='text-xs text-muted-foreground'>
                    Преглед и редакция
                  </div>
                </div>
              </Link>
              <div className='flex items-center gap-3 p-3 rounded-lg border opacity-50 cursor-not-allowed'>
                <div className='bg-green-100 p-2 rounded-md'>
                  <Users className='h-4 w-4 text-green-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Клиенти</div>
                  <div className='text-xs text-muted-foreground'>
                    Управление на база данни
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-lg border opacity-50 cursor-not-allowed'>
                <div className='bg-red-100 p-2 rounded-md'>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Настройки</div>
                  <div className='text-xs text-muted-foreground'>
                    Системни параметри
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
