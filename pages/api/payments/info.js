import axios from "axios";

export default async function handler(req, res) {
  const { subscribeId } = req.query;

  try {
    const response = await axios.get(`http://localhost:8080/api/v1/payments/info?subscribeId=${subscribeId}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("결제 정보 요청 실패:", error.message);
    res.status(500).json({ message: "결제 정보 로딩 실패" });
  }
}
