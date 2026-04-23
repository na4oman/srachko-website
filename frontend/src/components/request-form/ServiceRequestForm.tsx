import React, { useState } from 'react'
import {
  useForm,
  type Resolver,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createRequestSchema,
  REQUEST_TYPES,
  type CreateRequestInput,
  type RequestType,
} from '@/lib/validation'
import { createRequest, uploadToCloudinary } from '@/lib/api'
import axios from 'axios'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from 'lucide-react'

const STEPS = ['Тип заявка', 'Лични данни', 'Уред', 'Адрес', 'Преглед'] as const

// Add this type to handle the form values in a flat structure
interface ServiceRequestFormValues extends FieldValues {
  requestType: RequestType
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  model: string
  language: 'bg' | 'en'
  city: string
  street: string
  streetNumber: string
  district?: string
  block?: string
  entrance?: string
  floor?: string
  apartment?: string
  serialNumber?: string
  complaint?: string
  warrantyStatus?: 'Да' | 'Не' | 'Не знам'
  preferredDate?: string
  additionalInfo?: string
  message?: string
  imageUrls?: string[]
}

const ServiceRequestForm: React.FC = () => {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(
      createRequestSchema,
    ) as Resolver<ServiceRequestFormValues>,
    defaultValues: {
      requestType: 'Ремонт' as RequestType,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      brand: '',
      model: '',
      language: 'bg' as const,
      city: '',
      street: '',
      streetNumber: '',
      district: '',
      block: '',
      entrance: '',
      floor: '',
      apartment: '',
      serialNumber: '',
      complaint: '',
      warrantyStatus: 'Да' as const,
      preferredDate: '',
      additionalInfo: '',
      message: '',
      imageUrls: [],
    },
    mode: 'onSubmit',
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).map(file =>
        uploadToCloudinary(file),
      )
      const urls = await Promise.all(uploadPromises)
      const currentUrls = form.getValues('imageUrls') || []
      form.setValue('imageUrls', [...currentUrls, ...urls])
    } catch (err) {
      console.error('Upload error:', err)
      setError('Грешка при качване на снимките. Моля опитайте отново.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const currentUrls = form.getValues('imageUrls') || []
    form.setValue(
      'imageUrls',
      currentUrls.filter((_, i) => i !== index),
    )
  }

  const requestType = form.watch('requestType')

  const nextStep = () => {
    // If it's the first step (requestType), we can move forward since it has a default value
    if (step === 0) {
      setStep(1)
      return
    }

    // Validate current step fields before moving next
    const fieldsToValidate = getFieldsForStep(
      step,
    ) as Path<ServiceRequestFormValues>[]

    form.trigger(fieldsToValidate).then(isValid => {
      if (isValid) {
        setStep(s => Math.min(s + 1, STEPS.length - 1))
      }
    })
  }

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 0))
  }

  const onSubmit = async (data: ServiceRequestFormValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await createRequest(data as unknown as CreateRequestInput)
      setSubmitted(true)
    } catch (err: unknown) {
      console.error('Submit error:', err)
      let errorMessage =
        'Възникна грешка при изпращане на заявката. Моля опитайте отново.'

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldsForStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return ['requestType']
      case 1:
        return ['firstName', 'lastName', 'email', 'phone']
      case 2:
        return ['brand', 'model', 'serialNumber', 'complaint', 'warrantyStatus']
      case 3:
        return [
          'city',
          'district',
          'street',
          'streetNumber',
          'block',
          'entrance',
          'floor',
          'apartment',
        ]
      default:
        return []
    }
  }

  if (submitted) {
    return (
      <Card className='max-w-2xl mx-auto mt-10 text-center py-10'>
        <CardContent>
          <div className='w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Check className='h-8 w-8' />
          </div>
          <CardTitle className='text-2xl mb-2'>Заявката е изпратена!</CardTitle>
          <CardDescription className='text-lg'>
            Благодарим ви! Ще се свържем с вас възможно най-скоро на посочения
            телефон или имейл.
          </CardDescription>
          <Button className='mt-8' onClick={() => (window.location.href = '/')}>
            Към началната страница
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='max-w-3xl mx-auto py-10 px-4'>
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className='flex flex-col items-center gap-2 flex-1 relative'
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                  i <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] md:text-xs font-medium ${i <= step ? 'text-primary' : 'text-slate-500'}`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute h-[2px] w-full top-4 left-1/2 -z-0 ${
                    i < step ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
              <CardDescription>
                Моля попълнете необходимата информация за вашата заявка.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {error && (
                <div className='bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6'>
                  {error}
                </div>
              )}
              {step === 0 && (
                <FormField
                  control={form.control}
                  name='requestType'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Какъв тип е вашата заявка?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className='grid grid-cols-1 md:grid-cols-2 gap-4'
                        >
                          {REQUEST_TYPES.map(type => (
                            <FormItem key={type}>
                              <FormControl>
                                <RadioGroupItem
                                  value={type}
                                  className='sr-only'
                                />
                              </FormControl>
                              <FormLabel
                                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                                  field.value === type
                                    ? 'border-primary bg-primary/5'
                                    : 'border-slate-200'
                                }`}
                              >
                                <span>{type}</span>
                                {field.value === type && (
                                  <Check className='h-4 w-4 text-primary' />
                                )}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {step === 1 && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Име</FormLabel>
                        <FormControl>
                          <Input placeholder='Иван' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input placeholder='Иванов' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имейл</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='ivan@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder='0888 123 456' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      Снимки (по избор)
                    </label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      {(form.watch('imageUrls') || []).map((url, index) => (
                        <div
                          key={url}
                          className='relative aspect-square rounded-md overflow-hidden border'
                        >
                          <img
                            src={url}
                            alt={`Уред ${index + 1}`}
                            className='object-cover w-full h-full'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                      <label className='flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-slate-300 hover:border-primary cursor-pointer transition-colors'>
                        <Upload className='h-6 w-6 text-slate-400 mb-2' />
                        <span className='text-[10px] text-slate-500 text-center px-2'>
                          Качи снимка
                        </span>
                        <input
                          type='file'
                          multiple
                          accept='image/*'
                          className='hidden'
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploading && (
                      <div className='flex items-center gap-2 text-sm text-slate-500'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        <span>Качване...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='brand'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Марка</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Bosch, Miele, Samsung...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='model'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Модел</FormLabel>
                          <FormControl>
                            <Input placeholder='WGG14400BY' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='serialNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сериен номер</FormLabel>
                        <FormControl>
                          <Input placeholder='1234567890' {...field} />
                        </FormControl>
                        <FormDescription>
                          Намира се на етикета на уреда.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {requestType === 'Ремонт' && (
                    <FormField
                      control={form.control}
                      name='warrantyStatus'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel>В гаранция ли е уредът?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className='flex gap-4'
                            >
                              {['Да', 'Не', 'Не знам'].map(status => (
                                <FormItem
                                  key={status}
                                  className='flex items-center space-x-3 space-y-0'
                                >
                                  <FormControl>
                                    <RadioGroupItem value={status} />
                                  </FormControl>
                                  <FormLabel className='font-normal cursor-pointer'>
                                    {status}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='complaint'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание на проблема / нуждите</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Моля опишете накратко какъв е проблема с вашия уред...'
                            className='min-h-[120px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Град / Село</FormLabel>
                          <FormControl>
                            <Input placeholder='София' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='district'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Квартал</FormLabel>
                          <FormControl>
                            <Input placeholder='Младост 1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-2'>
                      <FormField
                        control={form.control}
                        name='street'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Улица</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='бул. Александър Малинов'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='streetNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>№</FormLabel>
                          <FormControl>
                            <Input placeholder='25' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-4 gap-4'>
                    <FormField
                      control={form.control}
                      name='block'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Бл.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='entrance'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Вх.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='floor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ет.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='apartment'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ап.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='preferredDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Предпочитана дата за посещение</FormLabel>
                          <FormControl>
                            <Input type='date' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='additionalInfo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Допълнителна информация</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Въведете допълнителни детайли, ако е необходимо...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className='space-y-6'>
                  <div className='bg-slate-50 p-4 rounded-lg space-y-4'>
                    <div className='grid grid-cols-2 gap-y-2 text-sm'>
                      <span className='text-slate-500 font-medium'>
                        Тип заявка:
                      </span>
                      <span className='font-semibold'>
                        {form.getValues('requestType')}
                      </span>

                      <span className='text-slate-500 font-medium'>
                        Клиент:
                      </span>
                      <span>
                        {form.getValues('firstName')}{' '}
                        {form.getValues('lastName')}
                      </span>

                      <span className='text-slate-500 font-medium'>
                        Телефон:
                      </span>
                      <span>{form.getValues('phone')}</span>

                      <span className='text-slate-500 font-medium'>Уред:</span>
                      <span>
                        {form.getValues('brand')} {form.getValues('model')}
                      </span>

                      <span className='text-slate-500 font-medium'>Адрес:</span>
                      <span>
                        {form.getValues('city')}, {form.getValues('street')}{' '}
                        {form.getValues('streetNumber')}
                      </span>
                    </div>
                  </div>
                  <p className='text-sm text-slate-500 italic'>
                    Моля проверете данните си още веднъж преди изпращане. Наш
                    служител ще се свърже с вас за потвърждение.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex justify-between border-t p-6'>
              <Button
                type='button'
                variant='outline'
                onClick={prevStep}
                disabled={step === 0 || isSubmitting}
              >
                <ChevronLeft className='mr-2 h-4 w-4' /> Назад
              </Button>

              {step < STEPS.length - 1 ? (
                <Button type='button' onClick={nextStep}>
                  Напред <ChevronRight className='ml-2 h-4 w-4' />
                </Button>
              ) : (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                      Изпращане...
                    </>
                  ) : (
                    'Изпрати заявка'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default ServiceRequestForm
