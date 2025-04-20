import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Container, CircularProgress, Button } from '@mui/material';

export default function MemberDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        const res = await fetch(`/api/members/${id}`, {
          method: 'GET',
            headers: { Authorization: token },
        });

        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes.message || '회원 정보를 불러오지 못했습니다.');
        }

        const data = await res.json();
        setMember(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>회원 정보를 불러오는 중입니다...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">에러: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container className='member'>
      <Typography variant="h4" gutterBottom>회원 정보</Typography>
      <Typography><strong>이름:</strong> {member.name}</Typography>
      <Typography><strong>이메일:</strong> {member.email}</Typography>
      <Typography><strong>전화번호:</strong> {member.phoneNumber}</Typography>
      <Typography><strong>주소:</strong> {member.address}</Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => router.push(`/members/${id}/edit`)}
      >
        회원정보 수정
      </Button>
    </Container>
  );
}
