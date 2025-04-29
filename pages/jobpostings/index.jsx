import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Pagination, Box } from '@mui/material';
import { useRouter } from 'next/router';
import JobPostingList from '@/components/jobpostinglist';

export default function JobPostingsPage() {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageNum: 1,
    pageSize: 10,
    totalPage: 1,
  });

  const fetchJobPostings = async (page = 1) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const res = await axios.get('/api/jobpostings', {
        headers: {
          Authorization: accessToken,
        },
        params: {
          pageNum: page,
          pageSize: pageInfo.pageSize,
        },
      });

      const jobPostingList = res.data.data;

      setJobPostings(jobPostingList);
      setPageInfo({
        pageNum: res.data.page.pageNum,
        pageSize: res.data.page.pageSize,
        totalPage: res.data.page.totalPage,
      });
    } catch (err) {
      console.error('잡 포스팅 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchJobPostings(1);
  }, []);

  const handlePageChange = (event, value) => {
    fetchJobPostings(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        잡 포스팅 목록
      </Typography>

      {jobPostings.map((posting) => (
        <JobPostingList
          key={posting.id}
          jobPosting={posting}
        />
      ))}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={pageInfo.totalPage}
          page={pageInfo.pageNum}
          onChange={(event, value) => { handlePageChange(event, value) }}
          color="primary"
        />
      </Box>
    </Container>
  );
}
