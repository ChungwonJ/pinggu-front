import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';

export default function MembershipDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMembership = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/memberships/${id}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('멤버십 조회 실패');
        const data = await res.json();
        setMembership(data.data);
      } catch (err) {
        console.error('멤버십 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/subscribes/${id}`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '구독 생성 실패');
      }

      alert('구독이 완료되었습니다!');
      router.push('/subscribes'); 
    } catch (err) {
      console.error('구독 생성 실패:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>멤버십 정보를 불러오는 중입니다...</Typography>
      </Container>
    );
  }

  if (!membership) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>멤버십 정보를 찾을 수 없습니다.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>멤버십 상세</Typography>
      <Typography><strong>이름:</strong> {membership.name}</Typography>
      <Typography><strong>가격:</strong> {membership.price}</Typography>
      <Typography><strong>수량:</strong> {membership.quantity}</Typography>
      <Typography><strong>연도:</strong> {membership.year}</Typography>

      <Button variant="contained" sx={{ mt: 3 }} onClick={()=>{handleSubscribe()}}>
        구독하기
      </Button>

      <Button variant="outlined" sx={{ mt: 3, ml: 2 }} onClick={() => router.push('/subscribe')}>
        목록으로 돌아가기
      </Button>
    </Container>
  );
}
