"use client";
import useAuth from "@/app/auths/auth";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { logOut } from "@/app/utils/LogOut";


export default function SellerStatusPage() {
  const { status } = useParams();
  const router = useRouter();
  const { user } = useAuth();


  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout =async () => {
await logOut()
  };

  const handleContact = () => {
    router.push('/contact')
  };

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          message: "Your seller account is under review. Please wait for approval.",
          icon: "⏳",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "suspended":
        return {
          message: "Your seller account is temporarily suspended. Please contact our support team for assistance.",
          icon: "⚠️",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        };
      case "blocked":
        return {
          message: "Your seller account has been blocked. Contact our support team immediately to resolve this issue.",
          icon: "🚫",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          message: "Invalid seller account status.",
          icon: "❓",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };


  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
          <div className="flex flex-wrap  justify-between space-y-2 md:space-y-0 items-center h-16">
            {/* Logo/Brand */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => router.push("/")}
            >
              
                <Image  src={`/logo.jpg`} width={60} height={60}  alt="" />
              
              <span className="text-xl font-bold text-gray-900">MarketPlace</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex  space-x-10 ">
              <button
                onClick={() => router.push("/")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={handleContact}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="flex justify-around items-center py-8 ">
          <button
            onClick={() => router.push("/")}
            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
          >
            Home
          </button>
          <button
            onClick={handleContact}
            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto   py-12 px-4 sm:px-6 lg:px-8">
        <div className={`rounded-lg ${statusConfig.bgColor} w-full p-2 shadow-sm border`}>
          <div className="text-center">
            <div className="text-4xl mb-4">{statusConfig.icon}</div>
            <h1 className={`text-2xl font-bold ${statusConfig.color} mb-4`}>
              Account Status
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {statusConfig.message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContact}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Contact Support
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Return to Homepage
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">
                Need immediate assistance?
              </h3>
              <p className="text-sm text-gray-600 ">
                Our support team is available 24/7 at
                <span className="text-blue-600 flex flex-wrap justify-center">saadicollection18@gmail.com </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 MarketPlace. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <button 
              onClick={()=>router.push('/privacy-policy')}
              className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </button>
              <button 
              onClick={()=>router.push('/terms-and-conditions')}
              className="hover:text-gray-700 transition-colors">
                Terms of Service
              </button>
              <button 
                onClick={handleContact}
                className="hover:text-gray-700 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}