import Layout from "@/components/layout";
import "@/styles/globals.scss";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  const isAuthPage = router.pathname === '/signin' || router.pathname === '/signup' || router.pathname === '/';

  return (
      <>
          {!isAuthPage && <Layout>
              <Component {...pageProps} />
          </Layout>}
          {isAuthPage && <Component {...pageProps} />}
      </>
  );
}
