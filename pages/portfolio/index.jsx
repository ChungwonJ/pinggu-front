import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

function PortfolioList() {
  const [portfolios, setPortfolios] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(6);
  const [totalPage, setTotalPage] = useState(1);

  const fetchPortfolios = async (page) => {
    const url = `${process.env.NEXT_PUBLIC_PORTFOLIO_API_URL}`;
    console.log('Request URL:', url);
    try {
      const response = await axiosInstance.get(url, {
        params: {
          pageNum: page,
          pageSize,
        },
      });

      setPortfolios(response.data.data);
      setTotalPage(response.data.pageInfo.totalPage);
    } catch (error) {
      console.error('포트폴리오 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchPortfolios(pageNum);
  }, [pageNum]);

  const handlePrev = () => {
    if (pageNum > 1) setPageNum((prev) => prev - 1);
  };

  const handleNext = () => {
    if (pageNum < totalPage) setPageNum((prev) => prev + 1);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        포트폴리오 목록
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardContent>
              <Typography variant="h6">{portfolio.title}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {portfolio.description}
              </Typography>
              {portfolio.fileUrl && (
                <a href={portfolio.fileUrl} target="_blank" rel="noopener noreferrer">
                  파일 보기
                </a>
              )}
              <Typography variant="caption">조회수: {portfolio.views}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={handlePrev} disabled={pageNum === 1}>
          이전
        </Button>
        <Typography variant="body1">Page {pageNum} / {totalPage}</Typography>
        <Button variant="outlined" onClick={handleNext} disabled={pageNum === totalPage}>
          다음
        </Button>
      </Box>
    </Box>
  );
}

export default PortfolioList;

