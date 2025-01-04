import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MotionDivWrap } from '../MotionDivWrap';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
// import NotConnectedPopUp from './NotConnectedPopUp';
// import useAppStorage from '../StateContextProvider/useAppStorage';

export default function App() {
  // const { openPopUp, togglePopUp } = useAppStorage();
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/dashboard', {replace: true});
  }, []);

  return (
    <div className='appContainer'>
      <Navbar />
      <Sidebar />
      <main className='md:pl-4 md:py-[26px] md:pr-[22px] space-y-4'>
        <MotionDivWrap className={`minHeight md:border-4 border-white1/20 md:rounded-[56px] px-4 py-6 md:py-10 bg-gray1 relative`} >
          <Outlet />
        </MotionDivWrap>
        <Footer />
      </main>
      {/* <NotConnectedPopUp handleClosePopUp={togglePopUp} openPopUp={openPopUp} /> */}
    </div>
  );
} 
