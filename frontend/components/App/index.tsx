import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MotionDivWrap } from '../MotionDivWrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import NotConnectedPopUp from './NotConnectedPopUp';
import useAppStorage from '../StateContextProvider/useAppStorage';

export default function App() {
  const [parentLinkActive, setParentActiveLink] = React.useState<string>('Dashboard');
  
  
  const { openPopUp, togglePopUp } = useAppStorage();
  const navigate = useNavigate();
  const setParentActive = (arg: string) => setParentActiveLink(arg);

  React.useEffect(() => {
    navigate('/dashboard', {replace: true});
  }, []);

  return (
    <div className='appContainer bg-[url(/images/hero/hero-bg1.png)] object-cover'>
      <Navbar />
      <Sidebar setParentActive={setParentActive} modalOpen={false} parentLinkActive={parentLinkActive}/>
      <main className='md:pl-4 py-[12px] md:py-[26px] md:pr-[22px] space-y-4'>
        <MotionDivWrap className={`minHeight md:border-4 border-white1/20 md:rounded-[56px] px-4 py-10 bg-gray1 relative`} >
          <Outlet />
        </MotionDivWrap>
        <Footer />
      </main>
      <NotConnectedPopUp handleClosePopUp={togglePopUp} openPopUp={openPopUp} />
    </div>
  );
} 
