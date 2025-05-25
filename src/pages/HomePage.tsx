interface HomePageProps {
  onLogout: () => void;
}

function HomePage({ onLogout }: HomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
      <p className="text-lg mb-4">Content goes here...</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default HomePage; 