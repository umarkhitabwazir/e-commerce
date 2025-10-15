"use client";
import React from 'react';
import Products from './components/buyer/HomeProducts.component';
import { UserInterface } from './utils/user.interface';



interface HomePageProps {
  user: UserInterface;
}

const HomePage: React.FC<HomePageProps> = () => {

  return (
    <div className='bg-bgGray'>
          <Products />
     
    </div>
  );
};

export default HomePage;