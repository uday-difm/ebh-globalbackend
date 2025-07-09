

"use client"

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-8" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex w-full max-w-6xl min-h-[692px] md:min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left: Image Section */}
        <div className="w-1/2 hidden md:block">
          <img
            src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Login-earthbyhumans.jpeg"
            alt="Login visual"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col text-black justify-center px-8 py-12 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}>Sign in to your account</h2>

          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Email or Username</label>
              <input
                type="text"
                placeholder="Enter email/username"
                className="w-full  border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-blue-700 text-sm font-medium hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600  text-white font-bold py-2 rounded transition-colors" style={{backgroundColor:"#54AE47"}}
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-8 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-700 font-semibold hover:underline">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

