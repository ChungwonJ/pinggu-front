import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { TextField, Button, Box } from '@mui/material';

function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email: email,
      password: password,
      name: name,
      phoneNumber: phone,
      address: address,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/signup`, requestData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입에 성공하였습니다');
      router.push('/signin');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('회원가입 실패:', error.response.data);
        alert("동일한 이메일이 있습니다.");
      } else {
        console.error('회원가입 실패:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className='sign'>
      <div className='signGrid'>
        <h1>회원가입</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth>
            회원가입
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default SignUp;
