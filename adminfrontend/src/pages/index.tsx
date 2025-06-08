import AdminLogin from "../components/AdminLogin";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <AdminLogin />
        </div>
      </main>
    </div>
  );
}
