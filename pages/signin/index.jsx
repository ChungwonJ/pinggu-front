import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signin', { email, password });
      const { accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        router.push('/mainpage');
      } else {
        console.error('accessToken이 응답에 포함되지 않았습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error.response?.data || error.message);
      setErrorMessage('이메일 또는 비밀번호를 다시 확인해주세요.');
    }
  };

  const handleSnsLogin = (provider) => {
    const providerUrls = {
      kakao: process.env.NEXT_PUBLIC_KAKAO_AUTH_URL,
      naver: process.env.NEXT_PUBLIC_NAVER_AUTH_URL,
      google: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL,
    };
  
    window.location.href = providerUrls[provider];
  };
  
  return (
    <div className="sign">
      <div className="signGrid">
        <h1>PortForU</h1>
        <div className="signInLogo">
          <img src="./portforu.png" alt="logo" />
        </div>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
          <TextField
            label="이메일"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <div className="signInBtn" style={{ marginTop: '16px' }}>
            <Button type="submit" variant="contained" fullWidth>
              로그인
            </Button>
            <Button variant="contained" fullWidth onClick={() => router.push('/signup')}>
              회원가입
            </Button>
          </div>
        </Box>
        <ul className="signInSns" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
          <li onClick={() => handleSnsLogin('kakao')}>
            <img src="./kakao.png" alt="카카오 로그인" />
          </li>
          <li onClick={() => handleSnsLogin('naver')}>
            <img src="./naver.png" alt="네이버 로그인" />
          </li>
          <li onClick={() => handleSnsLogin('google')}>
            <img src="./google.png" alt="구글 로그인" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SignIn;
