import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import ServiceRequestForm from './components/request-form/ServiceRequestForm'
import Dashboard from './pages/admin/Dashboard'
import RequestList from './pages/admin/RequestList'
import RequestDetails from './pages/admin/RequestDetails'

function App() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='request' element={<ServiceRequestForm />} />
          <Route path='contact' element={<Contact />} />
          <Route path='sign-in/*' element={<SignInPage />} />
          <Route path='sign-up/*' element={<SignUpPage />} />
        </Route>

        {/* Admin Routes - Protected by Clerk */}
        <Route
          path='/admin'
          element={
            isSignedIn ? (
              <div className='min-h-screen bg-gray-50'>
                <nav className='bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50'>
                  <div className='flex items-center gap-8'>
                    <h1 className='text-xl font-bold'>Srachko Admin</h1>
                    <div className='flex gap-4'>
                      <Link
                        to='/admin'
                        className='text-sm font-medium hover:text-primary'
                      >
                        Табло
                      </Link>
                      <Link
                        to='/admin/requests'
                        className='text-sm font-medium hover:text-primary'
                      >
                        Заявки
                      </Link>
                    </div>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <Link
                      to='/'
                      className='text-sm text-gray-600 hover:text-black'
                    >
                      Към сайта
                    </Link>
                    <UserButton afterSignOutUrl='/' />
                  </div>
                </nav>
                <Outlet />
              </div>
            ) : (
              <Navigate to='/sign-in' replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='requests' element={<RequestList />} />
          <Route path='requests/:id' element={<RequestDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
