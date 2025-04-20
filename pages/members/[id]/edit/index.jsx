import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function MemberEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/members/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
        }

        const data = await res.json();
        setForm({
          email: data.data.email || '',
          name: data.data.name || '',
          phoneNumber: data.data.phoneNumber || '',
          address: data.data.address || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '회원정보 수정 실패');
      }

      alert('회원 정보가 수정되었습니다.');
      router.push(`/members/${id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert('새 비밀번호가 일치하지 않습니다.');
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/members/${id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '비밀번호 변경 실패');
      }

      alert('비밀번호가 변경되었습니다.');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <Container sx={{ mt: 4 }}><Typography>불러오는 중...</Typography></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Typography color="error">에러: {error}</Typography></Container>;
  }

  return (
    <Container sx={{ mt: 4, maxWidth: '600px' }}>
      <div className='memberDelTop'>
        <Typography variant="h5" gutterBottom>회원 정보 수정</Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            if (!confirm('정말 탈퇴하시겠습니까?')) return;

            try {
              const token = localStorage.getItem('accessToken');
              const res = await fetch(`/api/members/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
                },
                body: JSON.stringify({
                  password: prompt('비밀번호를 입력하세요'),
                  passwordConfirm: prompt('비밀번호를 한 번 더 입력하세요'),
                }),
              });

              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || '회원 탈퇴 실패');
              }

              alert('회원 탈퇴가 완료되었습니다.');
              localStorage.removeItem('accessToken');
              window.location.href = '/';
            } catch (err) {
              alert(`오류: ${err.message}`);
            }
          }}
        >
          회원 탈퇴
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Typography sx={{ mt: 2 }}>
          <strong>이메일:</strong> {form.email}
        </Typography>
        <TextField label="이름" name="name" fullWidth value={form.name} onChange={handleChange} margin="normal" required />
        <TextField label="전화번호" name="phoneNumber" fullWidth value={form.phoneNumber} onChange={handleChange} margin="normal" required />
        <TextField label="주소" name="address" fullWidth value={form.address} onChange={handleChange} margin="normal" required />
        <div className='memberEditBtn'>
          <Button type="submit" variant="contained" fullWidth>저장</Button>
          <Button variant="contained" fullWidth onClick={() => router.push(`/members/${id}`)}>취소</Button>
        </div>
      </form>

      <Typography variant="h6" sx={{ mt: 4 }}>비밀번호 변경</Typography>
      <TextField
        label="현재 비밀번호"
        type="password"
        name="oldPassword"
        fullWidth
        value={passwordForm.oldPassword}
        onChange={handlePasswordChange}
        margin="normal"
        required
      />
      <TextField
        label="새 비밀번호"
        type="password"
        name="newPassword"
        fullWidth
        value={passwordForm.newPassword}
        onChange={handlePasswordChange}
        margin="normal"
        required
      />
      <TextField
        label="새 비밀번호 확인"
        type="password"
        name="confirmPassword"
        fullWidth
        value={passwordForm.confirmPassword}
        onChange={handlePasswordChange}
        margin="normal"
        required
      />
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
        onClick={() => { handlePasswordSubmit() }}
      >
        비밀번호 변경
      </Button>
    </Container>
  );
}
