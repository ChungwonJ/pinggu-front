import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function PortfolioWrite() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다');
      router.push('/signin');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
  
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          Authorization: accessToken, 
        },
        body: formData, 
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message || '업로드 중 오류가 발생했습니다.');
      }
  
      alert('포트폴리오가 등록되었습니다!');
      router.push('/portfolios');
    } catch (error) {
      console.error('포트폴리오 저장 실패:', error);
      alert(error.message || '업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>포트폴리오 작성</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          등록
        </button>
      </form>
    </div>
  );
}
