"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../lib/AuthContext"

// Map Firebase Auth error codes to user-friendly messages
function getFriendlyErrorMessage(error) {
  if (!error || !error.code) return "An unknown error occurred. Please try again.";
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Failed to sign in. Please try again.";
  }
}

export default function SignInPage() {
  const { signIn, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signIn(email, password)
      setSignedIn(true)
      // Do not redirect here; wait for userRole
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Redirect after login and userRole is available
  useEffect(() => {
    if (signedIn && !authLoading && userRole) {
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [signedIn, userRole, authLoading, router])

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

            {/* <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=56&width=56"
                  alt="Frankie Sullivan"
                  width="56"
                  height="56"
                  className="rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-semibold text-white">Dan (The Boss)</div>
                <div className="text-red-200">Founder, ATV Parts Pro</div>
              </div>
            </div> */}
{/* 
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div> */}
          </div>
        </div>

        <div className="text-red-200 relative z-10">© ATV Parts Pro 2024</div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              <img
                src="/images/home/Dan-logo.png"
                alt="Logo"
                className="max-w-[150px] max-h-[80px] object-contain rounded-full mx-auto my-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Sign in</h1>
              <p className="text-gray-700 mt-2">Welcome back! Please enter your details.</p>
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
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                onClick={() => {
                  /* Handle Google sign in */
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
                Sign in with Google
              </button>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                onClick={() => {
                  /* Handle Apple sign in */
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Sign in with Apple ID
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-black">
            Need an account?{" "}
            <a href="/signup" className="font-semibold text-red-600 hover:text-red-500">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
