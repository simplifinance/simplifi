import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MotionDivWrap } from '../MotionDivWrap';
// import { useAccount } from 'wagmi';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import NotConnectedPopUp from './NotConnectedPopUp';
import useAppStorage from '../StateContextProvider/useAppStorage';
// import Dashboard from '../topComponents/Dashboard';

export default function App() {
  const [parentLinkActive, setParentActiveLink] = React.useState<string>('Dashboard');
  
  
  const { openPopUp, togglePopUp } = useAppStorage();
  const navigate = useNavigate();
  // const location = useLocation().pathname;
  // const { isConnected } = useAccount();
  const setParentActive = (arg: string) => setParentActiveLink(arg);

  React.useEffect(() => {
    navigate('/dashboard', {replace: true});
  }, []);

  return (
    <div className='appContainer bg-[url(/images/hero/hero-bg1.png)] object-cover'>
      <Navbar />
      <Sidebar setParentActive={setParentActive} modalOpen={false} parentLinkActive={parentLinkActive}/>
      <main className='pl-[22px] md:pl-0 py-[22px] pr-[22px] space-y-4'>
        <MotionDivWrap className={`minHeight border-4 border-white1/20 rounded-[26px] md:rounded-[56px] px-4 py-10 bg-gray1 relative`} >
          <Outlet />
        </MotionDivWrap>
        <Footer />
      </main>
      <NotConnectedPopUp handleClosePopUp={togglePopUp} openPopUp={openPopUp} />
    </div>
  );
} 
