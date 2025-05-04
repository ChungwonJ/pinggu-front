import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import JobPostingList from '@/components/jobpostinglist';

export default function JobPostingsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken'); // 토큰 가져오기

      const res = await axios.get('/api/jobpostings/search', {
        params: { keyword: searchTerm, page: 0, size: 10 },
        headers: {
          Authorization: `${token}`,
        },
      });

      const hits = res.data.data || [];
      setJobPostings(hits);
    } catch (err) {
      console.error('검색 실패:', err);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>잡포스팅 검색</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>
      </Box>

      {loading ? (
        <Typography>로딩 중...</Typography>
      ) : (
        jobPostings.length === 0 ? (
          <Typography>검색 결과가 없습니다.</Typography>
        ) : (
          jobPostings.map((posting, index) => (
            <JobPostingList key={index} jobPosting={posting} />
          ))
        )
      )}
    </Container>
  );
}
