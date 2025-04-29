export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' });
  }

  try {
    const esResponse = await fetch(process.env.NEXT_PUBLIC_JOBPOSTING_SEARCH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await esResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Elasticsearch 프록시 에러:', error);
    return res.status(500).json({ message: 'Elasticsearch 서버 에러' });
  }
}
