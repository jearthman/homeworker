import Link from "next/link";

import { Button } from "@ds/button";

export default function Header() {
  return (
    <>
      <div className="flex justify-between bg-slate-500 text-gray-100 items-center p-2">
        <div className="font-bold px-3 text-2xl shadow-white">thera</div>
        <div className="flex gap-2">
          <Link href="api/auth/login">
            <Button intent="primary" fullWidth>
              Log in
            </Button>
          </Link>
          <Link href="api/auth/login">
            <Button intent="secondary" fullWidth>
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
