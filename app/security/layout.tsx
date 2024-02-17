import Navbar from "../components/Navbar";

interface SecurityLayoutProps {
  children: React.ReactNode;
}
export default function SecurityLayout({ children }: SecurityLayoutProps) {
  return (
    <div className="min-h-screen " style={{ backgroundColor: "whitesmoke" }}>
      <div className="navbar bg-neutral text-neutral-content">
        <button className="btn btn-ghost text-xl">VisitWise</button>
      </div>

      <div className="p-4">
        <div>{children}</div>
      </div>
    </div>
  );
}
