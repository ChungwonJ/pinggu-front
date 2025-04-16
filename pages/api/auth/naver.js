import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  const { NEXT_PUBLIC_NAVER_CLIENT_ID, NEXT_PUBLIC_NAVER_CLIENT_SECRET, NEXT_PUBLIC_NAVER_REDIRECT_URI } = process.env;

  try {
    // Naver에 액세스 토큰 요청
    const tokenResponse = await axios.post(`https://nid.naver.com/oauth2.0/token`, null, {
      params: {
        client_id: NEXT_PUBLIC_NAVER_CLIENT_ID,
        client_secret: NEXT_PUBLIC_NAVER_CLIENT_SECRET,
        redirect_uri: NEXT_PUBLIC_NAVER_REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      },
    });

    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userResponse.data;

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Naver login error:', error);
    res.status(500).json({ message: '네이버 로그인 실패' });
  }
}
