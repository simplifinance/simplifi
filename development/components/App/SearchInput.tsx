import React from 'react';

const SearchInput = () => {
  const [inputText, changeInputText] = React.useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    changeInputText(event.target.value);
  }

  return (
    <div className={`hidden md:block`}>
      <button className={`relative`}>
        <input 
          id="inputSearch" 
          type='search'
          placeholder={`${inputText? inputText : 'search'}`}
          onChange={onChange}
          className='rounded-lg border-4 border-white1/20 p-2 w-[100%] bg-white1/5'
        />
        <span className={`absolute top-[50%] right-0 translate-x-[-50%] translate-y-[-50%] text-white cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {/* <Image src={'/switch.svg'} alt='Search-Icon' width={50} height={50}/> */}
        </span>
      </button>
    </div>
  )
};

export default SearchInput;