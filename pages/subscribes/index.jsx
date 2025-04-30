import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

export default function Subscribe() {
  const router = useRouter();
  const [subscribes, setSubscribes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribes = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/subscribes', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });


      if (!res.ok) throw new Error('구독 목록 조회 실패');
      const data = await res.json();
      setSubscribes(data.data || []);
      console.log('구독 데이터:', data);
    } catch (err) {
      console.error('구독 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscribeId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/subscribes/${subscribeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('구독 삭제 실패');
      alert('삭제되었습니다.');
      fetchSubscribes();
    } catch (err) {
      console.error('구독 삭제 실패:', err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchSubscribes();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>구독 목록 불러오는 중...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>내 구독 목록</Typography>

      <Paper sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>멤버십 이름</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribes.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.membershipName}</TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>
                <Button  size="small">
                    결제
                  </Button>
                  <Button onClick={() => handleDelete(sub.id)} size="small" color="error">
                    취소
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
