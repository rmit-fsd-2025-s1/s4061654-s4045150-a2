import Header from "../components/Header";
import Footer from "../components/Footer";

import AdminLogin from "../components/AdminLogin";

type UserInformation = {
  userid: number;
  firstName: string;
  email: string;
};

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
