export default function AdminLogin() {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-black">Admin Login</h2>
      <p className="text-gray-600">Please log in to access admin features.</p>
      <form className="w-full mt-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
