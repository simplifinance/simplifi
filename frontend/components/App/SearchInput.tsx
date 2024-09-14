import React from 'react';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import { flexStart, flexCenter } from '@/constants';

const SearchInput = () => {
  const [inputText, changeInputText] = React.useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    changeInputText(event.target.value);
  }

  return (
    <React.Fragment>
      <div className={`w-full h-12 ${flexStart} border border-gray-200 rounded`}>
        <input 
          id="inputSearch" 
          placeholder={`${inputText? inputText : 'search'}`}
          onChange={onChange}
          className='rounded-l p-2 w-[100%]'
        />
        <button className={`${flexCenter} bg-orange-400 rounded-r h-full px-4 text-white cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {/* <Image src={'/switch.svg'} alt='Search-Icon' width={50} height={50}/> */}
        </button>
      </div>
    </React.Fragment>
  )
};

export default SearchInput;