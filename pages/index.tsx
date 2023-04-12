import "material-icons/iconfont/material-icons.css";
import Header from "./components/header";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Card } from "@ds/card";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfairDisplay",
});

export default function Landing() {
  return (
    <>
      <div className="flex flex-col h-screen bg-slate-500">
        <Header></Header>
        <div className="flex flex-col h-4/5 place-content-center gap-14">
          <div
            className={`${playfairDisplay.variable} font-sans text-6xl text-white text-center`}
          >
            What kind of therapy are you looking for?
          </div>
          <div className="flex justify-center gap-8">
            <div className="px-2 py-2 rounded-lg shadow-lg bg-gradient-to-b from-emerald-800 to-emerald-600 text-white w-1/5 hover:shadow-xl hover:shadow-emerald-500/50 hover:cursor-pointer transition ease-in-out duration-500">
              <div className="text-2xl font-bold">For Myself</div>
              <div className="">
                Get paired with a therapist that will fit your needs.
              </div>
            </div>
            <div className="px-2 py-2 rounded-lg shadow-lg bg-gradient-to-b from-sky-800 to-sky-600 text-white w-1/5 hover:shadow-xl hover:shadow-sky-500/50 hover:cursor-pointer transition ease-in-out duration-500">
              <div className="text-2xl font-bold">For My Relationship</div>
              <div className="">
                Find one of our couples councelors for your relationship.
              </div>
            </div>
            <div className="px-2 py-2 rounded-lg shadow-lg bg-gradient-to-b from-amber-800 to-amber-600 text-white w-1/5 hover:shadow-xl hover:shadow-amber-500/50 hover:cursor-pointer transition ease-in-out duration-500">
              <div className="text-2xl font-bold">For My Child</div>
              <div className="">
                Discover the ideal child therapist for your teen.
              </div>
            </div>
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
