import Link from "next/link";

import { Button } from "@/pages/components/design-system/button";

export default function Header() {
  return (
    <>
      <div className="flex justify-between bg-gradient-to-b from-slate-800 to-slate-500 text-gray-100 items-center p-4">
        <div className="font-bold px-3 text-5xl text-white">Thera</div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button intent="primary">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button intent="secondary">Sign up</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
