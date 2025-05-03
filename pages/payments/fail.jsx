import { useSearchParams } from 'next/navigation';

export default function PaymentFailPage() {
  const params = useSearchParams();
  const errorCode = params.get('errorCode');
  const subscribeId = params.get('subscribeId');

  const messages = {
    EXPIRED_PAYMENT: '만료되었거나 유효하지 않은 결제입니다.',
    CAPACITY_EXCEEDED: '정원이 초과되어 결제를 진행할 수 없습니다.',
    PAYMENT_FAILED: '결제에 실패했습니다. 다시 시도해주세요.',
    PAYMENT_CANCELLED: '결제가 취소되었습니다.',
    CANCEL_FAILED: '결제 취소에 실패했습니다. 관리자에게 문의해주세요.',
    INTERNAL_ERROR: '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.',
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: 'red' }}>결제에 실패했습니다.</h1>
      <p>{messages[errorCode] || '알 수 없는 오류입니다.'}</p>
      <a href={`/pay/${subscribeId}`}>결제 페이지로 돌아가기</a>
    </div>
  );
}
