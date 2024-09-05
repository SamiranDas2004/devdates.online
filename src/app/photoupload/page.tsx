'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      // Redirect or perform some action on success
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" ></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-lg shadow-gray-800/100">

        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
       
          <p className="text-xl font-semibold mb-2">Signed in as {session.user.name}</p>
        </div>

        {/* File Upload Form */}
        <form onSubmit={handleUpload} className="w-full flex flex-col items-center space-y-4">
          <div className="w-full flex flex-col items-center border-dashed border-2 border-gray-300 p-4 rounded-lg">
            <input
              type="file"
              name="photos"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-600 hover:text-gray-900 transition"
            >
              <p className="text-lg"> Click to Select Photos</p>
            </label>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
