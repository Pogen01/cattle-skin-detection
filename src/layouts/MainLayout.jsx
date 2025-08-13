import React from 'react'
import { Outlet } from 'react-router-dom'
import StickyNavbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div>
      <StickyNavbar />
      <Outlet />
    </div>
  )
}

export default MainLayout
