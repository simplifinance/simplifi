import React from 'react';
import { flexEnd, flexStart } from '@/constants';

export const ModeSwitch = (props: ModeProps) => {
  const { lightMode, toggleMode } = props;

  return (
    <button className={`${flexEnd}`} onClick={toggleMode}>
      {
        lightMode ? 
        <svg width="59" height="29" viewBox="0 0 59 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="58" height="28" rx="14" fill="#F8F8F8" stroke="#B1B1B1"/>
        <rect x="29" y="2" width="28" height="25" rx="12.5" fill="#F87C00"/>
        <g clipPath="url(#clip0_747_13467)">
        <path d="M42.3086 20.5703H44.4414V24.3438H42.3086V20.5703ZM42.3086 4.65625H44.4414V8.42969H42.3086V4.65625ZM49.9512 13.5156H54.0391V15.4844H49.9512V13.5156ZM32.7109 13.5156H36.7988V15.4844H32.7109V13.5156ZM35.0876 20.7754L37.9779 18.1074L39.4862 19.4993L36.5955 22.1676L35.0876 20.7754ZM47.2638 9.50102L50.1545 6.8327L51.6624 8.22494L48.7721 10.8932L47.2638 9.50102ZM47.2823 19.4813L48.7906 18.0894L51.6809 20.7573L50.173 22.1496L47.2823 19.4813ZM35.0684 8.24266L36.5763 6.85042L39.467 9.51841L37.9587 10.9106L35.0684 8.24266ZM43.375 9.57812C40.4246 9.57812 38.043 11.7766 38.043 14.5C38.043 17.2234 40.4246 19.4219 43.375 19.4219C46.3254 19.4219 48.707 17.2234 48.707 14.5C48.707 11.7766 46.3254 9.57812 43.375 9.57812ZM43.375 17.7812C41.4199 17.7812 39.8203 16.3047 39.8203 14.5C39.8203 12.6953 41.4199 11.2188 43.375 11.2188C45.3301 11.2188 46.9297 12.6953 46.9297 14.5C46.9297 16.3047 45.3301 17.7812 43.375 17.7812Z" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_747_13467">
            <rect width="22.75" height="21" fill="white" transform="translate(32 4)"/>
          </clipPath>
        </defs>
        </svg> : <svg width="59" height="29" viewBox="0 0 59 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="58" height="28" rx="14" fill="#505050" stroke="#B1B1B1"/>
          <rect x="2" y="2" width="28" height="25" rx="12.5" fill="#323232"/>
          <g clipPath="url(#clip0_747_13581)">
          <path d="M16.009 14C16.009 10.43 18.209 7.38003 21.319 6.13003C22.209 5.77003 22.069 4.44003 21.129 4.23003C20.029 3.99003 18.859 3.93003 17.649 4.09003C13.139 4.69003 9.52905 8.40003 9.05905 12.92C8.43905 18.93 13.129 24 19.009 24C19.739 24 20.439 23.92 21.129 23.77C22.079 23.56 22.229 22.24 21.329 21.87C18.109 20.58 15.999 17.46 16.009 14Z" fill="#F87C00"/>
          </g>
          <defs>
            <clipPath id="clip0_747_13581">
              <rect width="22.75" height="21" fill="white" transform="translate(5 4)"/>
            </clipPath>
          </defs>
        </svg>
      }   
    </button>
  )
}

interface ModeProps {
  toggleMode: () => void;
  lightMode: boolean;
}
