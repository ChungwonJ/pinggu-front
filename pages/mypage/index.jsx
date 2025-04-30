import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

function decodeJwtPayload(token) {
  try {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payloadBase64Url.length + (4 - payloadBase64Url.length % 4) % 4, '=');

    return JSON.parse(atob(payloadBase64));
  } catch (e) {
    console.error('JWT 디코딩 실패:', e);
    return null;
  }
}

export default function MyPage() {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const decoded = decodeJwtPayload(token);
      if (decoded?.sub) setId(decoded.sub);
      if (decoded?.userRole) setUserRole(decoded.userRole);
    }
  }, []);

  return (
    <div className="mypage">
      <h1>My Page</h1>

      <Button
        variant="contained"
        onClick={() => router.push(`/members/${id}`)}
        sx={{ mr: 1 }}
        disabled={!id}
      >
        회원정보 보기
      </Button>

      {userRole === 'ROLE_USER' && (
        <Button variant="contained" onClick={() => router.push('/memberships')}>
          구독하기
        </Button>
      )}

      {userRole === 'ROLE_ADMIN' && (
        <Button variant="contained" onClick={() => router.push('/admin/memberships')}>
          멤버십 관리
        </Button>
      )}
    </div>
  );
}
