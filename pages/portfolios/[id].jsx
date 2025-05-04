import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import JobPostingList from '@/components/jobpostinglist';

const Comments = dynamic(() => import('@/components/comments'), { ssr: false });

export default function PortfolioDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [portfolio, setPortfolio] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);

  // 포트폴리오 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/portfolios/${id}`, {
          headers: {
            Authorization: token, 
          },
        });

        const data = await res.json();
        setPortfolio(data.data);
      } catch (err) {
        console.error('단건 포트폴리오 조회 실패:', err);
      }
    };

    fetchPortfolio();
  }, [router.isReady, id]);

  // 포트폴리오 제목으로 자동 검색
  useEffect(() => {
    if (portfolio?.title) {
      fetchJobPostings(portfolio.title);
    }
  }, [portfolio]);

  // 잡포스팅 검색 API 호출
  const fetchJobPostings = async (keyword) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/jobpostings/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, 
        },
      });

      const data = await res.json();
      setJobPostings(data.data || []);
    } catch (err) {
      console.error('잡포스팅 검색 실패:', err);
    }
  };

  const handleEdit = () => {
    router.push(`/portfolios/edit/${id}`);
  };

  const handleDelete = async () => {
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        alert('삭제되었습니다.');
        router.push('/portfolios');
      } else {
        const data = await res.json();
        alert(data.message || '삭제 실패');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류 발생');
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/portfolios/download?url=${encodeURIComponent(portfolio.fileUrl)}`);
      if (!res.ok) throw new Error('다운로드 실패');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const fileName = decodeURIComponent(portfolio.fileUrl.split('/').pop());
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('다운로드 오류:', err);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  if (!portfolio) return <p>로딩 중...</p>;

  return (
    <>
      <div className='portDetailTilte'>
        <h2>포트폴리오 상세</h2>
        <div>
          {portfolio.fileUrl && (
            <>
              <span style={{ color: '#555' }}>
                첨부파일: {
                  (() => {
                    const filename = decodeURIComponent(portfolio.fileUrl.split('/').pop());
                    const [name, ext] = filename.split(/\.(?=[^\.]+$)/);
                    const shortName = name.length > 6 ? name.slice(0, 6) + '...' : name;
                    return `${shortName}.${ext}`;
                  })()
                }
              </span>
              <Button
                onClick={handleDownload}
                sx={{
                  marginLeft: '1rem',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0059c1' },
                }}
              >
                파일 다운로드
              </Button>
            </>
          )}
          <Button onClick={handleEdit}>수정</Button>
          <Button onClick={handleDelete}>삭제</Button>
        </div>
      </div>

      <div className='portDetail'>
        <div className='portDetailLeft'>
          <div className='portDetailSection'>
            <div className='portDetailTop'>
              <p><strong>제목:</strong> {portfolio.title}</p>
              <p><strong>조회수:</strong> {portfolio.views}</p>
            </div>
            <p><strong>설명:</strong> {portfolio.description}</p>
            <p><strong>작성일:</strong> {new Date(portfolio.createdAt).toLocaleString()}</p>
          </div>
          <Comments portfolioId={id} />
        </div>

        <div className='portDetailRight'>
          <h3>관련 채용공고</h3>
          {jobPostings.length === 0 ? (
            <p>관련 채용공고가 없습니다.</p>
          ) : (
            jobPostings.map((posting, index) => (
              <JobPostingList key={index} jobPosting={posting} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
