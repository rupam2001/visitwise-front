import Navbar from "../components/Navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen " style={{ backgroundColor: "whitesmoke" }}>
      <div className="sticky z-50 top-0">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
