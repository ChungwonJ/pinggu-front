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
      } catch (err) {
        console.error('포트폴리오 불러오기 실패:', err);
      }
    };

    fetchPortfolio();
  }, [router.isReady, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('imageFile', file);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: accessToken,
        },
        body: formData,
      });

      if (res.ok) {
        alert('수정 완료');
        router.push(`/portfolios/${id}`);
      } else {
        const data = await res.json();
        alert(data.message || '수정 실패');
      }
    } catch (err) {
      console.error('수정 실패:', err);
      alert('오류 발생');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>포트폴리오 수정</Typography>
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
          <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
        </Button>
        {file && <Typography>{file.name}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          수정하기
        </Button>
      </Box>
    </Container>
  );
}
