'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Likedperson() {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      const getMatches = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            'http://localhost:3000/api/getMatches',
            { email: session.user.email }
          );
          
          setUserInfo(response.data.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching matches:', error);
        } finally {
          setLoading(false);
        }
      };
      getMatches();
    }
  }, [session]);

  const reject = async (id: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/reject",
        { email: session?.user.email, id: id }
      );
      console.log(response.data);
      
      setUserInfo((prevUserInfo) => prevUserInfo.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error rejecting match:', error);
    }
  };

  const bothMatched = async (id: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/bothmatches",
        { email: session?.user.email, id: id }
      );
      const response2 = await axios.post("http://localhost:3000/api/showmatchesofmyside",{email:session?.user.email,id:id})
      console.log(response2.data);
      
      console.log(response.data);
    } catch (error: any) {
      console.log("Something went wrong", error);
    }
  };

  return (
    <div>
      <div className="overflow-y-auto bg-white w-1/3 h-screen p-4" style={{ maxHeight: '100vh' }}>
        <div className="text-center font-bold text-3xl mb-4 shadow-lg">Matches</div>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {userInfo.map((user) => (
              <li key={user.email} className="space-y-2">
                {user.photos && user.photos.length > 0 ? (
                  <Image
                    src={user.photos[0]}
                    alt={user.username}
                    className="w-full h-auto mt-2"
                    width={500}
                    height={500}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    No photo available
                  </div>
                )}
                <p>{user.username}</p>
                <div className='flex justify-center items-center'>
                  <button
                    onClick={() => bothMatched(user._id)}
                    className="bg-blue-400 mt-2 px-4 font-bold py-2 rounded-lg hover:bg-red-700 focus:outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(user._id)}
                    className="bg-red-600 mt-2 font-bold px-4 py-2 ml-8 rounded-lg hover:bg-red-700 focus:outline-none"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}