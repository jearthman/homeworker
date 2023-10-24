import GoogleSignInButton from "@/components/design-system/google-signin-button";

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
          <div></div>
        </div>
      </div>
    </>
  );
}
