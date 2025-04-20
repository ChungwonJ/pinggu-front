export default async function handler(req, res) {
  const { method } = req;
  const { pageNum = 1, pageSize = 6 } = req.query;

  const BACKEND_URL = process.env.NEXT_PUBLIC_PORTFOLIO_API_URL;
  const token = req.headers.authorization || '';

  try {
    switch (method) {
      case 'GET': {
        const backendRes = await fetch(
          `${BACKEND_URL}?pageNum=${pageNum}&pageSize=${pageSize}`,
          {
            method: 'GET',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await backendRes.json();
        return res.status(backendRes.status).json(data);
      }

      case 'POST': {
        const backendRes = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });

        const data = await backendRes.json();
        return res.status(backendRes.status).json(data);
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (err) {
    console.error('포트폴리오 API 프록시 오류:', err);
    return res.status(500).json({ message: '서버 프록시 오류' });
  }
}
