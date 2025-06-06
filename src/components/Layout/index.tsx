import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface LayoutProps {
  children: React.JSX.Element;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
};
