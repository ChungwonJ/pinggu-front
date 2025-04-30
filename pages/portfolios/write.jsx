import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PortfolioWrite() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 파일 업로드 함수
  const uploadFileToS3 = async (file, accessToken) => {
    const formData = new FormData();
    formData.append('portfolioFile', file); // 백엔드와 일치해야 함
  
    const res = await fetch('/api/portfolios/file', {
      method: 'POST',
      headers: {
        Authorization: accessToken,
      },
      body: formData,
    });
  
    if (!res.ok) {
      const text = await res.text(); // 텍스트로 받아보기
      console.error('업로드 실패 응답:', text); // 에러 내용 확인
      throw new Error('파일 업로드 실패');
    }
  
    const result = await res.json();
    return result.data; // URL
  };

  // 2. 포트폴리오 저장 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다');
      router.push('/signin');
      return;
    }

    try {
      let uploadedUrl = '';
      if (imageFile) {
        uploadedUrl = await uploadFileToS3(imageFile, accessToken);
      }

      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({
          title,
          description,
          portfolioFileUrl: uploadedUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '포트폴리오 등록 실패');

      alert('포트폴리오가 등록되었습니다!');
      router.push('/portfolios');
    } catch (error) {
      console.error('포트폴리오 저장 실패:', error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>포트폴리오 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={50}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>설명</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>파일첨부 (선택)</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          {isLoading ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
}

