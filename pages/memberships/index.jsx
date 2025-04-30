import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

function Memberships() {
  const router = useRouter();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchMemberships = async () => {
    try {
      const res = await fetch('/api/memberships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }),
        },
      });
      const data = await res.json();
      setMemberships(data.data || []);
    } catch (err) {
      console.error('멤버십 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>멤버십 목록 불러오는 중...</Typography>
      </Container>
    );
  }

  return (
    <Paper sx={{ mt: 5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>가격</TableCell>
            <TableCell>수량</TableCell>
            <TableCell>연도</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memberships.map((m) => (
            <TableRow key={m.id} hover style={{ cursor: 'pointer' }} onClick={() => router.push(`/memberships/${m.id}`)}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.price}</TableCell>
              <TableCell>{m.quantity}</TableCell>
              <TableCell>{m.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Memberships;