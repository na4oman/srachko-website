import { db } from './index.js'
import { serviceRequests } from './schema/index.js'

const dummyRequests = [
  {
    requestType: 'Ремонт',
    status: 'Нова/Получена',
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '0888111222',
    brand: 'Bosch',
    model: 'Serie 6',
    serialNumber: 'SN123456789',
    city: 'София',
    complaint: 'Пералнята не центрофугира.',
    warrantyStatus: 'Да',
    language: 'bg',
  },
  {
    requestType: 'Монтаж',
    status: 'В процес',
    firstName: 'Мария',
    lastName: 'Петрова',
    email: 'maria@example.com',
    phone: '0888333444',
    brand: 'Samsung',
    model: 'EcoBubble',
    city: 'Пловдив',
    complaint: 'Монтаж на нова съдомиялна.',
    warrantyStatus: 'Не',
    language: 'bg',
  },
  {
    requestType: 'Профилактика',
    status: 'Завършена',
    firstName: 'Георги',
    lastName: 'Димитров',
    email: 'georgi@example.com',
    phone: '0888555666',
    brand: 'Miele',
    model: 'W1',
    city: 'Варна',
    complaint: 'Годишна профилактика.',
    warrantyStatus: 'Да',
    language: 'bg',
  },
  {
    requestType: 'Запитване за част',
    status: 'Изчаква части',
    firstName: 'Елена',
    lastName: 'Николова',
    email: 'elena@example.com',
    phone: '0888777888',
    brand: 'AEG',
    model: 'Lavamat',
    city: 'Бургас',
    complaint: 'Търся уплътнение за люк.',
    warrantyStatus: 'Не знам',
    language: 'bg',
  },
  {
    requestType: 'Ремонт',
    status: 'За проверяване',
    firstName: 'Стефан',
    lastName: 'Колев',
    email: 'stefan@example.com',
    phone: '0888999000',
    brand: 'Whirlpool',
    model: 'FreshCare',
    city: 'Русе',
    complaint: 'Силни вибрации при работа.',
    warrantyStatus: 'Не',
    language: 'bg',
  }
]

async function seed() {
  console.log('Seeding dummy data...')
  try {
    for (const request of dummyRequests) {
      await db.insert(serviceRequests).values(request as any)
    }
    console.log('Successfully seeded dummy data!')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    process.exit(0)
  }
}

seed()
