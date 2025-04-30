import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Pagination,
  Stack,
  Divider,
} from '@mui/material';

export default function Comments({ portfolioId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 5;
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);

  const accessToken = localStorage.getItem('accessToken');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${portfolioId}`, {
        headers: { Authorization: accessToken },
      });
      setComments(res.data.data);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `/api/comments/${portfolioId}`,
        { content: newComment },
        { headers: { Authorization: accessToken } }
      );
      setNewComment('');
      setCurrentPage(1);
      fetchComments();
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const handleEdit = (commentId, currentContent) => {
    setEditingId(commentId);
    setEditingContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `/api/comments/${portfolioId}/${editingId}`,
        { content: editingContent },
        { headers: { Authorization: accessToken } }
      );
      setEditingId(null);
      setEditingContent('');
      fetchComments();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${portfolioId}/${commentId}`, {
        headers: { Authorization: accessToken },
      });
      fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (portfolioId && accessToken) {
      fetchComments();
    }
  }, [portfolioId, accessToken]);

  return (
    <div>
      <h1>댓글</h1>

      <div className='commentAdd'>
        <TextField
          fullWidth
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div>
          <Button variant="contained" onClick={() => { handleAddComment() }}>
            작성
          </Button>
        </div>
      </div>

      <List>
        {currentComments.map((comment) => (
          <div key={comment.id}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
              }}
            >
              {editingId === comment.id ? (
                <div className='commetListUpdate'>
                  <TextField
                    fullWidth
                    size="small"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => { handleSaveEdit() }}>
                      저장
                    </Button>
                    <Button onClick={() => { handleCancelEdit() }}>취소</Button>
                  </Stack>
                </div>
              ) : (
                <div className='commentList'>
                  <p>{comment.email}</p>
                  <p>{comment.content}</p>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleEdit(comment.id, comment.content)}>
                      수정
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDeleteComment(comment.id)}>
                      삭제
                    </Button>
                  </Stack>
                </div>
              )}
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      {comments.length > commentsPerPage && (
        <Stack mt={2} alignItems="center">
          <Pagination
            color="primary"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </div>
  );
}

