import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axiosInstance'; 
import { TextField, Button, Typography, Box } from '@mui/material';

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/signin`, { email, password });
  
      console.log('응답 전체:', response);
      console.log('응답 바디:', response.data);
    
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
    
      console.log('엑세스토큰:', accessToken);
      console.log('리프레시토큰:', refreshToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      axiosInstance.defaults.headers['Authorization'] = accessToken;
      console.log(axiosInstance.defaults.headers['Authorization']);
  
      router.push('/mainpage');
    } catch (error) {
      const message = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setErrorMessage(message); 
    }
  };

  const handleSnsLogin = (provider) => {
    const providerUrls = {
      kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`,
      google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`,
      naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}&state=randomString`,
    };

    window.location.href = providerUrls[provider];
  };

  useEffect(() => {
    const { code, provider } = router.query;

    if (code && provider) {
      const fetchUserData = async () => {
        try {
          await axiosInstance.get(`/api/auth/${provider}?code=${code}`);
          router.push('/portfolio');
        } catch (error) {
          console.error(`${provider} 로그인 실패`, error);
          setErrorMessage(`${provider} 로그인 실패`);
        }
      };

      fetchUserData();
    }
  }, [router.query]);

  return (
    <div className='sign'>
      <div className='signGrid'>
        <h1>PortForU</h1>
        <div className='signInLogo'>
          <img src="./portforu.png" alt="logo" />
        </div>
        <Box component="form" onSubmit={handleSubmit}>
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
          <div className='signInBtn'>
            <Button type="submit" variant="contained" fullWidth>
              로그인
            </Button>
            <Button variant="contained" fullWidth onClick={() => router.push('/signup')}>
              회원가입
            </Button>
          </div>
        </Box>
        <ul className='signInSns'>
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

