import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SignUpForm from '@/components/signupform';

function SignUp() {
  const router = useRouter();

  const handleSignUp = async (formData) => {
    try {
      const response = await axios.post('/api/auth/signup', formData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입에 성공하였습니다');
      router.push('/signin');
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="sign">
      <div className="signGrid">
        <h1>회원가입</h1>
        <SignUpForm onSubmit={handleSignUp} />
      </div>
    </div>
  );
}

export default SignUp;
