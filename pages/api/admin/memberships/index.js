export default async function handler(req, res) {
  const token = req.headers.authorization;
  const endpoint = process.env.NEXT_PUBLIC_MEMBERSHIP_ADMIN_API_URL;

  if (req.method === 'POST') {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }), 
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('멤버십 등록 실패:', error);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
}
