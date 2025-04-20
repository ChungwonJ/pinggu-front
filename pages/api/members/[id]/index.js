export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization; // 클라이언트에서 보낸 accessToken

  const endpoint = `${process.env.NEXT_PUBLIC_MEMBER_API_URL}/${id}`;

  if (['GET', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      const backendResponse = await fetch(endpoint, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }), // 토큰이 있을 때만 포함
        },
        body:
          req.method === 'PUT' || req.method === 'DELETE'
            ? JSON.stringify(req.body)
            : undefined,
      });

      const contentType = backendResponse.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await backendResponse.json() : await backendResponse.text();

      if (!backendResponse.ok) {
        return res.status(backendResponse.status).json({
          message: typeof data === 'string' ? data : data.message,
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('회원 정보 요청 실패:', error);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
}
