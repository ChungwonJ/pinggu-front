import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';

export default function EditPortfolioPage() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [originalFileUrl, setOriginalFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 기존 데이터 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPortfolio = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch(`/api/portfolios/${id}`, {
          headers: {
            Authorization: accessToken,
          },
        });

        const data = await res.json();
        setTitle(data.data.title);
        setDescription(data.data.description);
        setOriginalFileUrl(data.data.portfolioFileUrl || '');
      } catch (err) {
        console.error('포트폴리오 불러오기 실패:', err);
      }
    };

    fetchPortfolio();
  }, [router.isReady, id]);

  // ✅ S3에 새 파일 업로드
  const uploadFileToS3 = async (file, accessToken) => {
    const formData = new FormData();
    formData.append('portfolioFile', file);

    const res = await fetch('/api/portfolios/file', {
      method: 'POST',
      headers: {
        Authorization: accessToken,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('파일 업로드 실패 응답:', text);
      throw new Error('파일 업로드 실패');
    }

    const result = await res.json();
    return result.data; // 업로드된 S3 URL 반환
  };

  // ✏️ 포트폴리오 수정 요청
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다');
      router.push('/signin');
      return;
    }

    try {
      let finalFileUrl = originalFileUrl;

      // 새 파일 선택 시 → S3 업로드
      if (file) {
        finalFileUrl = await uploadFileToS3(file, accessToken);
      }

      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({
          title,
          description,
          portfolioFileUrl: finalFileUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '수정 실패');

      alert('수정 완료!');
      router.push(`/portfolios/${id}`);
    } catch (err) {
      console.error('수정 실패:', err.message);
      alert(err.message || '오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        포트폴리오 수정
      </Typography>
      <Box component="form" onSubmit={handleUpdate}>
        <TextField
          label="제목"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="설명"
          fullWidth
          multiline
          minRows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          파일 선택
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 1 }}>{file.name}</Typography>
        )}

        {!file && originalFileUrl && (
          <Typography sx={{ mt: 1, fontSize: 14, color: 'gray' }}>
            기존 파일: {originalFileUrl.split('/').pop()}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? '수정 중...' : '수정하기'}
        </Button>
      </Box>
    </Container>
  );
}
