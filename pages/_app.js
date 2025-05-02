import Layout from "@/components/layout";
import "@/styles/globals.scss";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script'; // ✅ 스크립트 로드를 위해 추가

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/signin' || router.pathname === '/signup' || router.pathname === '/';

  const [mode, setMode] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved) setMode(saved);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    setMode(newMode);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
        },
      }),
    },
  }), [mode]);

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
      />

      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!isAuthPage ? (
          <Layout toggleTheme={toggleTheme}>
            <Component {...pageProps} toggleTheme={toggleTheme} />
          </Layout>
        ) : (
          <Component {...pageProps} toggleTheme={toggleTheme} />
        )}
      </ThemeProvider>
    </>
  );
}
