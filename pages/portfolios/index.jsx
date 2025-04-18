import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Pagination,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import PortfolioList from '@/components/portfoliolist';

export default function Portfolios() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [pageInfo, setPageInfo] = useState({
    pageNum: 1,
    pageSize: 6,
    totalPage: 1,
  });

  const fetchPortfolios = async (page = 1) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const res = await axios.get('/api/portfolios', {
        headers: {
          Authorization: accessToken,
        },
        params: {
          pageNum: page,
          pageSize: pageInfo.pageSize,
        },
      });

      const portfolioList = res.data.data;

      setPortfolios(portfolioList);
      setPageInfo({
        pageNum: res.data.page.pageNum,
        pageSize: res.data.page.pageSize,
        totalPage: res.data.page.totalPage,
      });

      fetchCommentCounts(portfolioList);
    } catch (err) {
      console.error('포트폴리오 불러오기 실패:', err);
    }
  };

  const fetchCommentCounts = async (portfolioList) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const counts = {};

      await Promise.all(
        portfolioList.map(async (portfolio) => {
          try {
            const res = await axios.get(`/api/comments/${portfolio.id}`, {
              headers: { Authorization: accessToken },
            });
            counts[portfolio.id] = res.data.data.length;
          } catch (err) {
            console.error(`댓글 수 불러오기 실패: 포트폴리오 ${portfolio.id}`, err);
            counts[portfolio.id] = 0;
          }
        })
      );

      setCommentCounts(counts);
    } catch (err) {
      console.error('댓글 수 전체 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchPortfolios(1);
  }, []);

  const handlePageChange = (event, value) => {
    fetchPortfolios(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        포트폴리오 목록
      </Typography>

      {portfolios.map((portfolio) => (
        <PortfolioList
          key={portfolio.id}
          portfolio={portfolio}
          commentCount={commentCounts[portfolio.id]}
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

