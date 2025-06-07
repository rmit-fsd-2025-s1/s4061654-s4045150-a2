export default function Header() {
  return (
    <header className="bg-gray shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center">
            {/* Add any additional header elements here */}
          </div>
        </div>
      </div>
    </header>
  );
}
