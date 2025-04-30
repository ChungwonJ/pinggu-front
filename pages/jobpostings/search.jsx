import { useState } from 'react';
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

      const res = await axios.post('/api/jobpostings/search', {
        query: {
          multi_match: {
            query: searchTerm,
            type: 'bool_prefix',
            fields: [
              "title",
              "company",
              "location",
              "salary",
              "duty",
              "employmentType",
              "experienceYears",
              "skills",
              "keyAbilities"
            ]
          }
        }
      });
      

      const hits = res.data.hits.hits.map(hit => hit._source);

      setJobPostings(hits);
    } catch (err) {
      console.error('검색 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        잡포스팅 검색
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>
      </Box>

      {loading ? (
        <Typography>로딩 중...</Typography>
      ) : (
        <>
          {jobPostings.length === 0 ? (
            <Typography>검색 결과가 없습니다.</Typography>
          ) : (
            jobPostings.map((posting, index) => (
              <JobPostingList
                key={index}
                jobPosting={posting}
              />
            ))
          )}
        </>
      )}
    </Container>
  );
}
