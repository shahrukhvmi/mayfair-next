import MyAddress from '@/Components/MyAddress/MyAddress'
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout'
import React from 'react'

const myOrders = () => {
  return (
    <DashBoardLayout element={<MyAddress />} />

  )
}

export default myOrders