export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization;

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEMBER_API_URL}/password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }), // 토큰 포함 필요 시
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return res.status(500).json({ message: '서버 에러 발생' });
  }
}

