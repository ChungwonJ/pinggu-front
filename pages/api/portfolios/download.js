import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('파일 URL이 제공되지 않았습니다.');
  }

  try {
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      throw new Error('S3에서 파일을 가져오는 데 실패했습니다.');
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const fileName = decodeURIComponent(url.split('/').pop());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    response.body.pipe(res);
  } catch (err) {
    console.error('파일 다운로드 실패:', err);
    res.status(500).send('파일 다운로드 중 오류가 발생했습니다.');
  }
}