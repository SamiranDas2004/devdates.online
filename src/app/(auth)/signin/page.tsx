'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    const signInResponse = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResponse?.error) {
      setError(signInResponse.error);
    } else if (signInResponse?.ok) {
      router.replace('/dashboard');
    }
    setLoading(false); // Set loading to false when response is received
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('submitButton')?.click();
    }
  };

  if (status === 'authenticated') {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form
        className="w-full max-w-md text-xl font-semibold flex flex-col bg-white shadow-md p-6 rounded-lg"
        onSubmit={handleCredentialsSignIn}
        onKeyDown={handleKeyDown}
      >
        {error && (
          <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-600 rounded-md">
            {error}
          </span>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          id="submitButton"
          className={`w-full h-12 px-6 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-colors duration-150 ${
            loading ? 'cursor-not-allowed opacity-50 bg-white' : 'hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          disabled={loading} // Disable button during loading
        >
          {loading ? <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
          </div>: 'Log in'}
        </button>
      </form>
    </div>
  );
}
