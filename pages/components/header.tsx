import Link from "next/link";

import { Button } from "@/pages/components/design-system/button";

export default function Header() {
  return (
    <>
      <div className="flex justify-center bg-gradient-to-b from-gray-500 to-gray-200 text-gray-100 items-center p-4">
        <div className="font-bold px-3 text-5xl text-black">homeworkers</div>
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
