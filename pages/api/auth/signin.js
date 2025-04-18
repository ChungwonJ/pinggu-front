import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error('Backend Error:', data);
      return res.status(backendRes.status).json(data);
    }

    const { accessToken, refreshToken } = data.data;

    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('API 로그인 오류:', error);
    return res.status(500).json({ message: '서버 통신 중 오류 발생' });
  }
}
