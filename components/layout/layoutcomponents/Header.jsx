import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchModal from '@/components/modal';

function Header() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false); 

  const handleSearch = (keyword) => {
    console.log('검색어:', keyword);
    // 👉 검색 결과 페이지 이동이나 검색 처리 로직 추가 가능
    // 예: router.push(`/search?keyword=${keyword}`);
  };

  return (
    <div className='header'>
      <div className='headerGrid'>
        <div className='logo' onClick={() => { router.push('/mainpage') }}>
          <img src="./portforu.png" alt="logo" />
        </div>

        <div>
          <ul className='nav'>
            <li onClick={() => { router.push('/portfolios') }}>포트</li>
            <li>채용공고</li>
            <li onClick={() => { router.push('/portfolios/write') }}>등록하기</li>
          </ul>
        </div>

        <div className='headerBtn'>
          <div onClick={() => { setOpenSearch(true) }}>
            <SearchIcon />
          </div>
          <div>
            <AccountCircleIcon />
          </div>
        </div>
      </div>

      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}

export default Header;
