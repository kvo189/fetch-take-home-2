import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <main id='main-layout' className='h-screen flex flex-col justify-center'>{children}</main>;
};

export default MainLayout;
