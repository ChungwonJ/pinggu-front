import { useRouter } from 'next/router'
import React from 'react'

function Header() {
  const router = useRouter();

  return (
    <div className='header'>
      <div className='headerGrid'>
        <div className='logo'><img src="./portforu.png" alt="" /></div>
        <div>
          <ul className='nav'>
            <li onClick={()=>{router.push('/portfolio')}}>포트</li>
            <li>채용공고</li>
            <li>등록하기</li>
          </ul>
        </div>
        <div className='headerBtn'>
          <button>돋보기</button>
          <button>마이페이지</button>
        </div>
      </div>
    </div>
  )
}

export default Header