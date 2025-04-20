import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Comments = dynamic(() => import('@/components/comments'), { ssr: false });

export default function PortfolioDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [portfolio, setPortfolio] = useState(null);

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
        setPortfolio(data.data);
      } catch (err) {
        console.error('단건 포트폴리오 조회 실패:', err);
      }
    };

    fetchPortfolio();
  }, [router.isReady, id]);

  const handleEdit = () => {
    router.push(`/portfolios/edit/${id}`);
  };

  const handleDelete = async () => {
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
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
                    const [name, ext] = filename.split(/\.(?=[^\.]+$)/); // 확장자 분리
                    const shortName = name.length > 6 ? name.slice(0, 6) + '...' : name;
                    return `${shortName}.${ext}`;
                  })()
                }
              </span>
              <Link
                href={portfolio.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginRight: '1rem',
                  marginLeft: '1rem'
                }}
              >
                파일 다운로드
              </Link>
            </>
          )}
          <Button onClick={() => { handleEdit() }} >수정</Button>
          <Button onClick={() => { handleDelete() }} >삭제</Button>
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
          채용공고자리
        </div>
      </div>
    </>
  );
}
