"use client";

import Image from "next/image";
import { TextHighlight, InfoCard, Background } from "./components";
import MainCard from "./container";

export default function Home() {
  return (
    <Background>
      <div className="w-full flex flex-col justify-center items-center h-full gap-10">
        <Image src="/partnership.svg" alt="partnership" width={240} height={60} />
        <div className="w-1/3 font-bold text-gray-100 flex flex-row items-center gap-2 justify-center">
          <span>Get started by editing</span>
          <TextHighlight label="src/app/page.tsx" url="https://docs.sophon.xyz" />
        </div>

        <MainCard />

        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl flex flex-row items-stretch gap-6">
            <InfoCard
              iconSrc="/ic-doc.svg"
              alt="documentation"
              title="Documentation"
              description="Dive into our guides and API"
              className="flex-1"
              ImageComponent={Image}
              url="https://docs.sophon.xyz"
            />
            <InfoCard
              iconSrc="/ic-git.svg"
              alt="github"
              title="GitHub"
              description="View our example repos"
              className="flex-1"
              ImageComponent={Image}
              url="https://github.com/sophon-org/sophon-account"
            />
            <InfoCard
              iconSrc="/ic-logo-x.svg"
              alt="x"
              title="Sophon on X"
              description="Follow us and stay up to date"
              className="flex-1"
              ImageComponent={Image}
              url="https://x.com/sophon"
            />
          </div>
        </div>
      </div>
    </Background>
  );
}
