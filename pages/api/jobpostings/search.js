export default async function handler(req, res) {
  const { keyword, page = 0, size = 10 } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: '검색어가 필요합니다.' });
  }

  const endpoint = process.env.NEXT_PUBLIC_JOBPOSTING_SEARCH_API_URL;
  const url = `${endpoint}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('[JSON 파싱 실패]', err);
      return res.status(502).json({ message: '응답이 JSON이 아님', raw: text });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[프록시 오류]', err);
    return res.status(500).json({ message: '프록시 서버 내부 오류' });
  }
}
