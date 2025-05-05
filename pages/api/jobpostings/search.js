export default async function handler(req, res) {
  const token = req.headers.authorization;
  const endpoint = process.env.NEXT_PUBLIC_JOBPOSTING_SEARCH_API_URL;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
  }

  try {
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = `${endpoint}?${queryString}`;

    console.log(' 프록시 요청 URL:', fullUrl);
    console.log(' Authorization:', token);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    // content-type이 JSON이 아닌 경우 (예: 로그인 페이지 HTML)
    if (!contentType || !contentType.includes('application/json')) {
      console.error('JSON이 아닌 응답 수신:', text.slice(0, 300));
      return res.status(502).json({ message: '외부 API가 JSON을 반환하지 않음', html: text });
    }

    const data = JSON.parse(text);

    if (!response.ok) {
      console.error('외부 API 응답 오류:', response.status, data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('프록시 서버 내부 오류:', error);
    return res.status(500).json({ message: '프록시 서버 에러' });
  }
}
