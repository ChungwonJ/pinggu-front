import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: 'green' }}>결제가 완료되었습니다!</h1>
      <p>주문 번호: <strong>{orderId}</strong></p>
      <a href="/mainpage">홈으로 돌아가기</a>
    </div>
  );
}
