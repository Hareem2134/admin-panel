"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}








// "use client";
// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       if (result?.ok) {
//         router.push("/dashboard"); // Navigate to dashboard on success
//       } else {
//         setError("Invalid email or password. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("An unexpected error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 shadow rounded w-96"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-sm font-semibold mb-2"
//             htmlFor="password"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             placeholder="Enter your password"
//             className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className={`w-full py-2 rounded text-white ${
//             loading
//               ? "bg-blue-300 cursor-not-allowed"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
