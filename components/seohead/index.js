import Head from 'next/head';

export default function SeoHead({ title, description, url, image }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="naver-site-verification" content="bd2d6dd4a6a802ef8933210ef9cbfd91105403eb" />
      <meta name="google-site-verification" content="M5QjhTbql7-t5VHxzfMM3z6czfD2681UAgt36oD2wHs" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
