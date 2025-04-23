import MyAccount from '@/Components/MyAccount/MyAccount'
import DashBoardPage from '@/layout/Dashboard/DashBoardPage'
import React from 'react'

const dashboard = () => {
    return (
        <>


            <DashBoardPage>
                <MyAccount />
            </DashBoardPage>

        </>
    )
}

export default dashboard