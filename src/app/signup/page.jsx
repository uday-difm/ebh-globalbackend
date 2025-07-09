

"use client"

const SignUp = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}>Sign Up</h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid for First Name & Last Name */}
              <div>
                <label className="block font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid for Username & Email */}
              <div>
                <label className="block font-semibold mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your Username"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid for Password & Confirm Password */}
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter your Confirm Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                className="form-checkbox h-4 w-4 text-green-600 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                Accept <a href="#" className="text-blue-700 hover:underline">Terms of Use</a> & <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2 rounded transition-colors"
              style={{ backgroundColor: "#54AE47" }}
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-8 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}>
            Login If You Have Account?{" "}
            <a href="/login" className="text-blue-700 font-semibold hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

