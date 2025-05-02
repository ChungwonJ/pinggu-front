import Head from "next/head";
import Image from "next/image";
import SignIn from "./signin";
import SeoHead from "@/components/seohead";

export default function Home() {
  return (
    <>
      <SeoHead
        title="PortForU"
        description="당신의 커리어를 위한 최고의 포트폴리오 플랫폼. IT 취업 정보까지 한 번에!"
        url="https://pinggu.vercel.app"
        image="https://pinggu.vercel.app/og-image.png"
      />
      <SignIn />
    </>
  );
}
