"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../lib/AuthContext"

// Map Firebase Auth error codes to user-friendly messages
function getFriendlyErrorMessage(error) {
  if (!error || !error.code) return "An unknown error occurred. Please try again.";
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Failed to sign up. Please try again.";
  }
}

export default function SignUpPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }
    try {
      await signUp(email, password)
      router.push("/")
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white p-12 flex-col justify-between bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/5506059/pexels-photo-5506059.jpeg')" }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
            <span className="text-xl font-semibold text-red-600">ATV Parts Pro</span>
          </div>

          <div className="max-w-md">
            <blockquote className="text-3xl font-medium leading-relaxed mb-12 text-white">
              {"For over 15 years, ATV Parts Pro has been the trusted source for genuine ATV parts. "}
            </blockquote>
          </div>
        </div>
        <div className="text-red-200 relative z-10">© ATV Parts Pro 2024</div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              <img
                src="/images/logo-A.jpg"
                alt="Logo"
                className="max-w-[150px] max-h-[80px] object-contain rounded-full mx-auto my-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Sign up</h1>
              <p className="text-gray-700 mt-2">Create your account to get started.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                onClick={() => {
                  /* Handle Google sign up */
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                onClick={() => {
                  /* Handle Apple sign up */
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Sign up with Apple ID
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-black">
            Already have an account?{" "}
            <a href="/signin" className="font-semibold text-red-600 hover:text-red-500">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 