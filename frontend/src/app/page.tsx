"use client";
import React from 'react';
import Products from './components/Products.component';
import adminAuth from './utils/adminAuth';
import AdminHomePageComponent from './components/AdminHomePage.component';
import { UserInterface } from './utils/user.interface';


interface HomePageProps {
  user: UserInterface;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const role = ["admin", "superadmin"];
  const roleAuth = user ? role.includes(user.role) : false;

  return (
    <div className='bg-bgGray'>
      {roleAuth ? (
        
          <AdminHomePageComponent />
    
      ) : (
      
          <Products />
    
      )}
    </div>
  );
};

export default adminAuth(HomePage);