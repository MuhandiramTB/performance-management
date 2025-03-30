import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1b2e] text-white">
      {/* Header */}
    

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-transparent bg-clip-text">
            Employee Performance System
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Streamline your performance management process with our comprehensive solution.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#252a3d] rounded-lg p-8">
            <div className="bg-[#7c3aed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Set Goals</h3>
            <p className="text-gray-400">Define clear objectives and track progress effectively</p>
          </div>

          <div className="bg-[#252a3d] rounded-lg p-8">
            <div className="bg-[#7c3aed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-400">Monitor achievements and identify areas for improvement</p>
          </div>

          <div className="bg-[#252a3d] rounded-lg p-8">
            <div className="bg-[#7c3aed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Get Feedback</h3>
            <p className="text-gray-400">Receive valuable insights and grow professionally</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-[#7c3aed] text-white px-8 py-3 rounded-full font-medium hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2"
          >
            Sign In
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/register"
            className="border border-[#7c3aed] text-[#7c3aed] px-8 py-3 rounded-full font-medium hover:bg-[#7c3aed] hover:text-white transition-colors"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
