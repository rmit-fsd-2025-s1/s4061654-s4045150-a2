import Header from "../components/Header";
import Footer from "../components/Footer";

import AdminLogin from "../components/AdminLogin";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex gap-6 w-full max-w-6xl mx-auto">
        <AdminLogin />
      </div>

      <Footer />
    </div>
  );
}
