import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  const { NEXT_PUBLIC_KAKAO_REST_API_KEY, NEXT_PUBLIC_KAKAO_CLIENT_SECRET, NEXT_PUBLIC_KAKAO_REDIRECT_URI } = process.env;

  try {
    // 카카오에 액세스 토큰 요청
    const tokenResponse = await axios.post(`https://kauth.kakao.com/oauth/token`, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: NEXT_PUBLIC_KAKAO_REST_API_KEY,
        client_secret: NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
        redirect_uri: NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userResponse.data;

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Kakao login error:', error);
    res.status(500).json({ message: '카카오 로그인 실패' });
  }
}
