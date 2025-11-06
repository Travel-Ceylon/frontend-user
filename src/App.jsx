import React, { useEffect } from 'react'
import Home from './pages/Home'
import Footer from './components/Footer'
import UserProfile from './pages/UserProfile'
import Taxi from './pages/taxi/Taxi'
import TaxiBookings from './pages/taxi/TaxiBookings'
import SpecificTaxi from './pages/taxi/SpecificTaxi'

import Stays from './pages/stays/Stays'

import Guides from './pages/guide/Guides'
import GuideSearchResults from './pages/guide/GuideSearchResults'
import Guide from './pages/guide/Guide'

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import StaysFilter from './pages/stays/StaysFilter'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'react-hot-toast'

function App() {

  const navigate = useNavigate();

  const { loadUser, isAuthChecking } = useAuthStore();
  const { pathname } = useLocation();

  useEffect(() => {
    loadUser();
  }, [])

  if (isAuthChecking) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <>
      {!["/", "/login"].includes(pathname) && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user' element={<UserProfile />} />
        <Route path='/login' element={<Login />} />

        <Route path='/taxi' element={<Taxi />} />
        <Route path='/taxi-bookings' element={<TaxiBookings />} />
        <Route path="/specific-taxi" element={<SpecificTaxi />} />

        <Route path="/stays" element={<Stays />} />
        <Route path='/stays/filter' element={<StaysFilter />} />
        <Route path='/stays/:id' element={<StaysFilter />} />

        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/search" element={<GuideSearchResults />} />
        <Route path="/guide/:id" element={<Guide />} />
      </Routes>

      {!["/login"].includes(pathname) && <Footer />}

      <Toaster/>
    </>
  )
}

export default App