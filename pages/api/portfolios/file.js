import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.headers.authorization || '';
  const BACKEND_UPLOAD_URL = process.env.NEXT_PUBLIC_FILE_UPLOAD_API_URL;

  try {
    const { files } = await parseForm(req);

    const fileField = files.portfolioFile;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!file || !file.filepath) {
      console.error(' 파일이 비었거나 경로 없음:', file);
      return res.status(400).json({ message: '파일이 첨부되지 않았습니다.' });
    }

    console.log('업로드 파일:', file.originalFilename, file.filepath);

    const formData = new FormData();
    formData.append('portfolioFile', fs.createReadStream(file.filepath), file.originalFilename);

    const response = await axios.post(BACKEND_UPLOAD_URL, formData, {
      headers: {
        Authorization: token,
        ...formData.getHeaders(),
      },
    });

    console.log('백엔드 응답:', response.data);
    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error('파일 업로드 프록시 오류:', err.response?.data || err.message);
    return res.status(500).json({ message: '서버 오류 (백엔드와 통신 실패)' });
  }
}
