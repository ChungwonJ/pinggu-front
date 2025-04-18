export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pageNum = 1, pageSize = 6 } = req.query;

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_PORTFOLIO_API_URL}?pageNum=${pageNum}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error('백엔드 오류:', data);
      return res.status(backendRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('포트폴리오 API 프록시 오류:', err);
    return res.status(500).json({ message: '포트폴리오 데이터를 불러올 수 없습니다.' });
  }
}
