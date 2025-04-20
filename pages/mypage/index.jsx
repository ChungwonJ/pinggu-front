import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

export default function MyPage() {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        if (decodedPayload?.sub) {
          setId(decodedPayload.sub);
        }

        if (decodedPayload?.userRole) {
          setUserRole(decodedPayload.userRole);
        }
      } catch (e) {
        console.error('토큰 파싱 실패:', e);
      }
    }
  }, []);

  return (
    <div className="mypage">
      <h1>My Page</h1>

      <Button
        variant="contained"
        onClick={() => {
          router.push(`/members/${id}`);
        }}
        sx={{ mr: 1 }}
      >
        회원정보 보기
      </Button>

      {userRole === 'ROLE_USER' && (
        <Button variant="contained" onClick={() => router.push('/subscribe')}>
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
