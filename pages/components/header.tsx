import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="flex justify-between bg-slate-700 text-gray-200 items-baseline p-2">
        <div className="font-bold">THERA</div>
        <Link
          href="api/auth/login"
          className="p-1 rounded border border-gray-200"
        >
          Login
        </Link>
      </div>
    </>
  );
}
