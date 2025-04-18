import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function SignUpForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      email,
      password,
      name,
      phoneNumber: phone,
      address,
    };

    if (onSubmit) {
      onSubmit(requestData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="이메일"
        type="email"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="이름"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="전화번호"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <TextField
        label="주소"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        회원가입
      </Button>
    </Box>
  );
}
