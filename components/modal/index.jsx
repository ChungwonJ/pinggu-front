import { useState } from 'react';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

export default function SeachModal({ open, onClose, onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(keyword);
    } else {
      console.log('🔍 검색어:', keyword);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="search-modal-title"
      aria-describedby="search-modal-description"
    >
      <Box sx={style}>
        <Typography id="search-modal-title" variant="h6" component="h2" mb={2}>
          검색
        </Typography>
        <TextField
          fullWidth
          label="검색어 입력"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" onClick={() => { handleSearch() }}>
            검색
          </Button>
          <Button onClick={onClose}>취소</Button>
        </Box>
      </Box>
    </Modal>
  );
}
