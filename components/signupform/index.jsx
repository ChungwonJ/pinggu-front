import { useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';

export default function SignUpForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const fullAddress = `(${zonecode}) ${address} ${extraAddress}`.trim();
  
    const requestData = {
      email,
      password,
      name,
      phoneNumber: phone,
      address: fullAddress,
    };
  
    if (onSubmit) {
      onSubmit(requestData);
    }
  };

  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.roadAddress;
        let extra = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extra += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extra += (extra ? `, ${data.buildingName}` : data.buildingName);
        }
        if (extra !== '') {
          extra = ` (${extra})`;
        }

        setZonecode(data.zonecode);
        setAddress(fullAddress);
        setExtraAddress(extra);
      },
    }).open();
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

      <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
        <Grid item xs={9}>
          <TextField
            label="우편번호"
            variant="outlined"
            required
            fullWidth
            value={zonecode}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="outlined" onClick={handleSearchAddress} fullWidth>
            주소 검색
          </Button>
        </Grid>
      </Grid>

      <TextField
        label="기본 주소"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={address}
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="상세 주소"
        variant="outlined"
        margin="normal"
        fullWidth
        value={extraAddress}
        onChange={(e) => setExtraAddress(e.target.value)}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        회원가입
      </Button>
    </Box>
  );
}
