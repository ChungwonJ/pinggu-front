export default async function handler(req, res) {
  const { subscribeId } = req.query;
  const token = req.headers.authorization;
  const endpoint = `${process.env.NEXT_PUBLIC_SUBSCRIBE_API_URL}/${subscribeId}`;

  if (req.method === 'DELETE') {
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: token }),
        },
      });

      const data = await response.json();

      console.log('response.status:', response.status);

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('구독 취소 실패:', error);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
}
