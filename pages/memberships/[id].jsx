import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import Script from 'next/script';

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

  const getCustomerNameFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return '알 수 없음';

      const decoded = jwtDecode(token);
      return decoded.name || '알 수 없음';
    } catch (e) {
      console.error('JWT 디코딩 실패:', e);
      return '알 수 없음';
    }
  };

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`/api/subscribes/membership/${id}`, {
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

      const result = await res.json();
      const subscribeId = result.data?.id;
      const orderId = `order_${subscribeId}`;
      const amount = membership.price; // 이미 프론트에서 불러온 멤버십 가격

      // Toss 결제 SDK 바로 실행
      const tossPayments = window.TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);

      tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: membership.name,
        customerName: getCustomerNameFromToken(),
        successUrl: `${process.env.NEXT_PUBLIC_TOSS_SUCCESS_URL}?orderId=${orderId}`,
        failUrl: `${process.env.NEXT_PUBLIC_TOSS_FAIL_URL}?subscribeId=${subscribeId}`,
      });

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
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        strategy="beforeInteractive"
      />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>멤버십 상세</Typography>
        <Typography><strong>이름:</strong> {membership.name}</Typography>
        <Typography><strong>가격:</strong> {membership.price}</Typography>
        <Typography><strong>수량:</strong> {membership.quantity}</Typography>
        <Typography><strong>연도:</strong> {membership.year}</Typography>

        <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubscribe}>
          구독하기
        </Button>

        <Button variant="outlined" sx={{ mt: 3, ml: 2 }} onClick={() => router.push('/subscribe')}>
          목록으로 돌아가기
        </Button>
      </Container>
    </>
  );
}

