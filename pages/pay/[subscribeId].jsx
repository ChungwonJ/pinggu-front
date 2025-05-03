import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Script from "next/script";
import axios from "axios";

export default function PaymentPage() {
  const router = useRouter();
  const { subscribeId } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!subscribeId) return;

    axios
      .get(`/api/payments/info?subscribeId=${subscribeId}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("결제 정보 불러오기 실패", err);
        alert("결제 정보를 불러오는 데 실패했습니다.");
      });
  }, [subscribeId]);

  const handlePayment = () => {
    if (!data) return;

    const tp = window.TossPayments(data.clientKey);
    tp.requestPayment("카드", {
      amount: data.amount,
      orderId: data.orderId,
      orderName: data.orderName,
      customerName: data.customerName,
      successUrl: data.successUrl,
      failUrl: data.failUrl,
    });
  };

  const cancelPayment = () => {
    if (!data || !confirm("결제를 취소하시겠습니까?")) return;
    router.push(
      `/api/v1/payments/cancel?orderId=${encodeURIComponent(data.orderId)}&reason=사용자 요청 취소`
    );
  };

  return (
    <div className="p-6">
      <Script src="https://js.tosspayments.com/v1/payment" strategy="beforeInteractive" />
      <h1 className="text-xl font-bold mb-4">결제 페이지</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePayment}>
        결제하기
      </button>
      <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={cancelPayment}>
        결제 취소
      </button>
    </div>
  );
}
