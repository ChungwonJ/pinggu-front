export default async function handler(req, res) {
  const { membershipId } = req.query;
  const token = req.headers.authorization;
  const endpoint = `${process.env.NEXT_PUBLIC_SUBSCRIBE_API_URL}/${membershipId}`;

  if (req.method === 'POST') {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('구독 생성 실패:', error);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
}