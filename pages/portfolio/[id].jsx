import { PORTFOLIO } from '@/data';
import { useRouter } from 'next/router';
import React from 'react'

function PortfolioItem() {
  const router = useRouter();

  const { id } = router.query;

  const portfolioItem = PORTFOLIO.find(item => item.id === parseInt(id));

  return (
    <div>
      <h1>포트폴리오 아이템: {portfolioItem.title}</h1>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = PORTFOLIO.map(item => ({ params: { id: item.id.toString() } }));
  return { paths, fallback: false };
}

export async function getStaticProps() {
  return { props: { PORTFOLIO } };
}

export default PortfolioItem