import MyAccount from '@/Components/MyAccount/MyAccount'
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout'
import React from 'react'

const dashboard = () => {
    return (
        <>


            <DashBoardLayout>
                <MyAccount />
            </DashBoardLayout>

        </>
    )
}

export default dashboard