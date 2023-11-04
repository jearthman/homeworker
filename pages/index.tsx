import GoogleSignInButton from "@/components/design-system/google-signin-button";

export default function Landing() {
  return (
    <>
      <div
        className="flex h-screen flex-col bg-gray-200"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(174, 216, 141, 0.7), rgba(174, 216, 141, 0) 50%),
                    radial-gradient(circle at 70% 30%, rgba(186, 230, 253, 0.7), rgba(186, 230, 253, 0) 50%),
                    rgb(229, 231, 235)`,
        }}
      >
        <div className="flex h-4/5 flex-col place-content-center content-center gap-14">
          <div className="text-center text-5xl font-bold">
            homeworkers
            <div className="mt-1">🤖🤝🧑‍🎓</div>
          </div>
          <div className="flex justify-center gap-8">
            <GoogleSignInButton />
          </div>
          <div className="mx-4 text-center opacity-50">
            Mobile layout not implemented yet, please try homeworkers at your PC
            😅
          </div>
        </div>
      </div>
    </>
  );
}
