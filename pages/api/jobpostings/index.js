export default async function handler(req, res) {
  const token = req.headers.authorization;
  const endpoint = process.env.NEXT_PUBLIC_JOBPOSTING_API_URL;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
  }

  try {
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('JSON이 아닌 응답:', text);
      return res.status(502).json({ message: '외부 서버로부터 잘못된 응답을 받았습니다.' });
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('프록시 서버 에러:', error);
    return res.status(500).json({ message: '프록시 서버 에러 발생' });
  }
}