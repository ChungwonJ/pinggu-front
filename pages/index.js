import Head from "next/head";
import Image from "next/image";
import SignIn from "./signin";
import SeoHead from "@/components/seohead";

export default function Home() {
  return (
    <>
      <SeoHead
        title="PortForU | 포트포유 - IT 포트폴리오 공유 플랫폼"
        description="포트포유는 IT 취업 준비생을 위한 최고의 포트폴리오 업로드 및 공유 플랫폼입니다."
        url="https://pinggu.vercel.app"
        image="./portforu.png"
      />
      <SignIn />
    </>
  );
}
