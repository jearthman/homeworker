import "material-icons/iconfont/material-icons.css";
import { Playfair_Display } from "next/font/google";
import GoogleSignInButton from "@ds/google-signin-button";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfairDisplay",
});

export default function Landing() {
  return (
    <>
      <div className="flex h-screen flex-col bg-gray-200">
        <div className="flex h-4/5 flex-col place-content-center content-center gap-14">
          <div className="text-center text-5xl font-bold text-black">
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
