export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).json({ message: 'Refresh Token이 존재하지 않습니다.' });
  }

  try {
    const backendResponse = await fetch(process.env.NEXT_PUBLIC_AUTH_REFRESH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getBearerTokenFromCookie(cookieHeader),
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return res.status(backendResponse.status).json(data);
    }

    return res.status(200).json(data); // accessToken, refreshToken 반환
  } catch (error) {
    console.error('Refresh 실패:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
}

function getBearerTokenFromCookie(cookieHeader) {
  const cookies = cookieHeader.split(';').reduce((acc, cur) => {
    const [key, value] = cur.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  return `${cookies.refreshToken}`;
}
