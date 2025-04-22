import MyProfile from '@/Components/MyProfile/MyProfile'
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout'
import React from 'react'

const myOrders = () => {
  return (
    <DashBoardLayout element={<MyProfile />} />

  )
}

export default myOrders