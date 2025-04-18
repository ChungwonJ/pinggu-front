export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: 'AccessToken이 필요합니다.' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_PORTFOLIO_API_URL}/${id}`, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('단건 포트폴리오 조회 실패:', err);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
}
