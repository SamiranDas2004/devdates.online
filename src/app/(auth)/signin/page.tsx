'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import the Image component

export default function SignInComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
          className="w-full h-12 px-6 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Log in
        </button>
      </form>
      <hr className="w-full max-w-md my-6" />
      <button
        onClick={() => signIn('github')}
        className="w-full max-w-md h-12 px-3 flex items-center justify-center text-lg font-semibold text-black bg-white rounded-lg border border-gray-300 transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt="GitHub Logo"
          width={24} // Replace with your preferred width
          height={24} // Replace with your preferred height
          className="mr-2"
        />
        Sign in with GitHub
      </button>
    </div>
  );
}