import "material-icons/iconfont/material-icons.css";
import Header from "./components/header";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Card } from "@/pages/components/design-system/card";
import { Button } from "@ds/button";
import { GoogleSignInButton } from "@ds/google-signin-button";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfairDisplay",
});

export default function Landing() {
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-200">
        <div className="flex flex-col h-4/5 content-center place-content-center gap-14">
          <div className="font-bold text-center text-5xl text-black">
            homeworkers <span className="ml-8">🤖🤝🧑‍🎓</span>
          </div>
          <div className="flex justify-center gap-8">
            <GoogleSignInButton />
          </div>
        </div>

        {/* <div className="flex flex-col">
            <Image
              src="/img/woman_therapy.jpg"
              alt="Woman therpist talks with girl."
              width={500}
              height={500}
            ></Image>
            <p className="text-center text-xs">
              Image by pch.vector on Freepik
            </p>
          </div> */}
        {/* </div> */}
      </div>
    </>
  );
}
