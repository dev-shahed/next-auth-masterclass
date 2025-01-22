import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link className="bg-slate-500" href={"/my-account"}>
        My account
      </Link>
    </>
  );
}
