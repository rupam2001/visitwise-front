import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex justify-center items-center h-full  min-h-screen">
      <div className="h-full w-auto flex flex-col items-center justify-center">
        <Image src={logo} alt="Visit Wise" width={150 * 3} />
        <p className="text-slate-500 mb-6">
          Easy and Efficient way to manage your daily visitors!
        </p>
        <Link href={"/auth"}>
          <button className="btn btn-outline btn-primary">Get Started</button>
        </Link>
      </div>
      <div></div>
    </div>
  );
}

// #7F8CD9
