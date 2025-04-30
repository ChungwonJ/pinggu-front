import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button, Container, Typography } from '@mui/material';
import PortfolioList from '@/components/portfoliolist';
import JobPostingList from '@/components/jobpostinglist'; 
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [jobPostings, setJobPostings] = useState([]); 

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get('/api/portfolios', {
          headers: { Authorization: accessToken },
          params: { pageNum: 1, pageSize: 6 },
        });

        const list = res.data.data;
        setPortfolios(list);

        const counts = {};
        await Promise.all(
          list.map(async (p) => {
            try {
              const res = await axios.get(`/api/comments/${p.id}`, {
                headers: { Authorization: accessToken },
              });
              counts[p.id] = res.data.data.length;
            } catch {
              counts[p.id] = 0;
            }
          })
        );
        setCommentCounts(counts);
      } catch (err) {
        console.error('메인 포트폴리오 불러오기 실패:', err);
      }
    };

    const fetchJobPostings = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get('/api/jobpostings', {
          headers: { Authorization: accessToken },
          params: { pageNum: 1, pageSize: 3 },
        });

        const list = res.data.data;
        setJobPostings(list);
      } catch (err) {
        console.error('메인 채용공고 불러오기 실패:', err);
      }
    };

    fetchPortfolios();
    fetchJobPostings();
  }, []);

  return (
    <>
      <div className='mainPageTop'>
        <h2>
          최신 포트폴리오
        </h2>
        <Button className='mainPageTopAll' onClick={() => { router.push('/portfolios') }}>전체보기</Button>
      </div>

      {portfolios.slice(0, 3).map((portfolio) => (
        <PortfolioList
          key={portfolio.id}
          portfolio={portfolio}
          commentCount={commentCounts[portfolio.id]}
        />
      ))}

      <div className='mainPageTop' style={{ marginTop: '2rem' }}>
        <h2>
          추천 채용공고
        </h2>
        <Button className='mainPageTopAll' onClick={() => { router.push('/jobpostings') }}>전체보기</Button>
      </div>

      {jobPostings.slice(0, 3).map((posting) => (
        <JobPostingList
          key={posting.id}
          jobPosting={posting}
        />
      ))}
    </>
  );
}

