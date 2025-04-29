import { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, CircularProgress
} from '@mui/material';

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

export default function Membership() {
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', year: '' });
  const [editingId, setEditingId] = useState(null);
  const [authorized, setAuthorized] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      setAuthorized(false);
      return;
    }

    const decoded = decodeJwtPayload(token);
    if (decoded?.userRole === 'ROLE_ADMIN') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [token]);

  const fetchMemberships = async () => {
    try {
      const res = await fetch('/api/memberships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const data = await res.json();
      console.log('멤버십 데이터:', data); // 추가!!
      setMemberships(data.data || []);
    } catch (err) {
      console.error('불러오기 실패:', err);
    }
  };
  

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorized) {
      alert('관리자만 등록할 수 있습니다.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/memberships/${editingId}` : '/api/admin/memberships';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          name: form.name,
          price: parseInt(form.price),
          quantity: parseInt(form.quantity),
          year: parseInt(form.year),
        }),
      });

      if (!res.ok) throw new Error('저장 실패');

      alert(editingId ? '수정되었습니다.' : '등록되었습니다.');
      setForm({ name: '', price: '', quantity: '', year: '' });
      setEditingId(null);
      fetchMemberships();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (membership) => {
    setForm({
      name: membership.name,
      price: membership.price,
      quantity: membership.quantity,
      year: membership.year,
    });
    setEditingId(membership.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    if (!authorized) {
      alert('관리자만 삭제할 수 있습니다.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/memberships/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error('삭제 실패');
      alert('삭제되었습니다.');
      fetchMemberships();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authorized === null) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>접근 권한 확인 중...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>멤버십 관리</Typography>

      {authorized && (
        <form onSubmit={handleSubmit}>
          <TextField label="이름" name="name" value={form.name} onChange={handleChange} required fullWidth sx={{ mt: 1 }} />
          <TextField label="가격" name="price" type="number" value={form.price} onChange={handleChange} required fullWidth sx={{ mt: 1 }} />
          <TextField label="수량" name="quantity" type="number" value={form.quantity} onChange={handleChange} required fullWidth sx={{ mt: 1 }} />
          <TextField label="연도" name="year" type="number" value={form.year} onChange={handleChange} required fullWidth sx={{ mt: 1 }} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {editingId ? '수정' : '등록'}
          </Button>
          {editingId && (
            <Button type="button" variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => {
              setEditingId(null);
              setForm({ name: '', price: '', quantity: '', year: '' });
            }}>
              취소
            </Button>
          )}
        </form>
      )}

      <Paper sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>가격</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>연도</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memberships.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.price}</TableCell>
                <TableCell>{m.quantity}</TableCell>
                <TableCell>{m.year}</TableCell>
                {authorized && (
                  <TableCell>
                    <Button onClick={() => handleEdit(m)} size="small">수정</Button>
                    <Button onClick={() => handleDelete(m.id)} color="error" size="small">삭제</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

