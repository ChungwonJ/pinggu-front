import { useRouter } from 'next/router';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Switch } from '@mui/material';

function Header({ toggleTheme }) {
  const router = useRouter();

  return (
    <div className='header'>
      <div className='headerGrid'>
        <div className='logo' onClick={() => { router.push('/mainpage') }}>
          <img src="./portforu.png" alt="logo" />
        </div>

        <div>
          <ul className='nav'>
            <li onClick={() => { router.push('/portfolios') }}>포트</li>
            <li onClick={() => { router.push('/jobpostings') }}>채용공고</li>
            <li onClick={() => { router.push('/portfolios/write') }}>등록하기</li>
          </ul>
        </div>

        <div className='headerBtn' style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div onClick={() => { router.push('/jobpostings/search') }}>
            <SearchIcon />
          </div>
          <div onClick={() => { router.push('/mypage') }}>
            <AccountCircleIcon />
          </div>
          <Switch onChange={toggleTheme} />
        </div>
      </div>
    </div>
  );
}

export default Header;
