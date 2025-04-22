
import React from 'react';
import DashBoardLayout from '@/layout/Dashboard/dashBoardLayout';
import MyAccount from '@/Components/MyAccount/MyAccount';

const Dashboard = ({ data }) => {
  return (
    <DashBoardLayout>
      <MyAccount data={data} />
    </DashBoardLayout>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch('https://staging.mayfairweightlossclinic.co.uk/api/products/GetAllProducts');
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    const json = await res.json();

    return {
      props: {
        data: json?.data || null,
      },
    };
  } catch (error) {
    console.error('Fetch error:', error.message);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default Dashboard;
