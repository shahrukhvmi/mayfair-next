import React from 'react';
import MyAccount from '@/Components/MyAccount/MyAccount';
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout';

const Dashboard = () => {
    return (
        <DashBoardLayout element={<MyAccount />} />


    );
};

export default Dashboard;
