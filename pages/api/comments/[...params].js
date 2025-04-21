import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;
  const { params } = req.query;
  const token = req.headers.authorization;

  try {
    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_COMMENT_API_URL}/${params.join('/')}`,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { message: '서버 오류' };
    res.status(status).json(message);
  }
}
