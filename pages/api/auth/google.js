import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  const { NEXT_PUBLIC_GOOGLE_CLIENT_ID, NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_GOOGLE_REDIRECT_URI } = process.env;

  try {
    // Google에 액세스 토큰 요청
    const tokenResponse = await axios.post(`https://oauth2.googleapis.com/token`, null, {
      params: {
        client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirect_uri: NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      },
    });

    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userResponse.data;

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: '구글 로그인 실패' });
  }
}
