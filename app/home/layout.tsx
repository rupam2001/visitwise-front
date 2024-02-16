import Navbar from "../components/Navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <Navbar />
      </div>
      {children}
    </div>
  );
}
