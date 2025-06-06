export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization;
  const endpoint = `${process.env.NEXT_PUBLIC_MEMBERSHIP_ADMIN_API_URL}/${id}`;

  if (req.method === 'PUT' || req.method === 'DELETE') {
    try {
      const response = await fetch(endpoint, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }), 
        },
        body: req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('멤버십 수정/삭제 실패:', error);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
}
