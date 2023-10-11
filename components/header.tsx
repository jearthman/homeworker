import Link from "next/link";

import Button from "@/components/design-system/button";

export default function Header() {
  return (
    <>
      <div className="flex items-center justify-center bg-gradient-to-b from-gray-500 to-gray-200 p-4 text-gray-100">
        <div className="px-3 text-5xl font-bold text-black">homeworkers</div>
        {/* <div className="flex gap-2">
          <Link href="/login">
            <Button intent="primary">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button intent="secondary">Sign up</Button>
          </Link>
        </div> */}
      </div>
    </>
  );
}
