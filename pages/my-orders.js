import MyOrders from '@/Components/MyOrders/MyOrders'
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout'
import React from 'react'

const myOrders = () => {
  return (
    <DashBoardLayout element={<MyOrders />} />

  )
}

export default myOrders