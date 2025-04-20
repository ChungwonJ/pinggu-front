export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  const BACKEND_URL = process.env.NEXT_PUBLIC_PORTFOLIO_API_URL;
  const token = req.headers.authorization || '';

  try {
    switch (method) {
      case 'GET': {
        const backendRes = await fetch(`${BACKEND_URL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        const data = await backendRes.json();
        return res.status(backendRes.status).json(data);
      }

      case 'PUT': {
        const backendRes = await fetch(`${BACKEND_URL}/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: token,
          },
          body: req.body instanceof FormData ? req.body : JSON.stringify(req.body),
        });

        const data = await backendRes.json();
        return res.status(backendRes.status).json(data);
      }

      case 'DELETE': {
        const backendRes = await fetch(`${BACKEND_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });

        const data = await backendRes.json();
        return res.status(backendRes.status).json(data);
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (err) {
    console.error('포트폴리오 상세 프록시 오류:', err);
    return res.status(500).json({ message: '서버 프록시 오류' });
  }
}
