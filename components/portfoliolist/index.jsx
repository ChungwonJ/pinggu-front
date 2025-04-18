import { useRouter } from 'next/router';

export default function PortfolioList({ portfolio, commentCount }) {
  const router = useRouter();

  return (
    <div
      className="portList"
      onClick={() => { router.push(`/portfolios/${portfolio.id}`) }}
    >
      <p><strong>{portfolio.id}</strong></p>
      <p>{portfolio.title}</p>
      <p>{portfolio.description}</p>
      <p><strong>조회수:</strong> {portfolio.views}</p>
      <p><strong>댓글:</strong> {commentCount ?? 0}</p>
    </div>
  );
}
