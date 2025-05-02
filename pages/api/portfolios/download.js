import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    console.error('[다운로드 실패] URL 없음');
    return res.status(400).send('파일 URL이 제공되지 않았습니다.');
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    console.error('다운로드 요청 URL:', decodedUrl);

    const response = await fetch(decodedUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('S3 응답 실패:', errorText);
      throw new Error('S3에서 파일을 가져오는 데 실패했습니다.');
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const fileName = decodeURIComponent(url.split('/').pop());
    const arrayBuffer = await response.arrayBuffer();

    res.setHeader('Access-Control-Allow-Origin', 'https://pinggu.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('다운로드 실패:', err);
    res.status(500).send('파일 다운로드 중 오류가 발생했습니다.');
  }
}

// 만약 OPTIONS 프리플라이트 요청 처리 필요 시
export const config = {
  api: {
    bodyParser: false,
  },
};

