'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image component from Next.js

const PhotoUpload = () => {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos', photo));
    formData.append('email', session?.user.email || '');

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/path-to-your-background-image.jpg)' }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
        {/* User Info */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-xl font-semibold mb-2">Signed in as {session.user.name}</p>
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={session.user.image || '/default-avatar.png'} // Provide a default image
              alt="User Avatar"
              layout="fill" // Use layout="fill" to fill the container
              objectFit="cover" // Ensure the image covers the container
              className="rounded-full"
            />
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Sign out
          </button>
        </div>

        {/* File Upload Form */}
        <form onSubmit={handleUpload} className="w-full flex flex-col items-center space-y-4">
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-600"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PhotoUpload;