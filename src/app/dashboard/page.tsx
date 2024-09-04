'use client'

import * as React from 'react';
import Image from 'next/image'; // Import Image from next/image
import { Card, CardContent } from '../../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Likedperson from '../likePeople/page';

function CarouselDemo() {
  const { data: session, status } = useSession();
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const router = useRouter();

  const handleGenderChange = async (value: string) => {
    setGender(value);
  
    try {
      // Fetch data from the API and store it in a variable
      const response = await axios.post('http://localhost:3000/api/findgenders', { gender: value });
      console.log('Response data from findgenders:', response.data);
  
 console.log(response.data,session?.user.email);
 
  
      const result = await axios.post('http://localhost:3000/api/notinclude', {
        email: session?.user.email,
        data: response.data.data // Ensure this is an array
      });
  
      console.log('Response data from notinclude:', result.data);
      
      // Update the users state with the fetched data
      setUsers(result.data.data);
  
      // Reset the current and photo index to start from the beginning
      setCurrentIndex(0);
      setPhotoIndex(0);
    } catch (error) {
      console.error('Error fetching users by gender:', error);
    }
  };
  

  const handleNextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhotoIndex(0);
    }
  };

  const handlePreviousUser = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPhotoIndex(0);
    }
  };

  const handleNextPhoto = () => {
    if (photoIndex < users[currentIndex].photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const handlePreviousPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  const likeAPerson = async (email: string) => {
    try {
      const emailId = session?.user.email;
      console.log(emailId);

      const response = await axios.post('http://localhost:3000/api/getUserId', {
        email: emailId,
      });
      const userId = response.data.id;
      console.log(userId);

      const likeResponse = await axios.post('http://localhost:3000/api/likeby', {
        userId: userId,
        email: email,
      });
      console.log('like data', likeResponse.data);
      // if (likeResponse.data.match) {
      //   router.replace(`/chat?userEmail=${userId}&targetUserEmail=${likeResponse.data.targetUserEmail}`);
      // }

      
    } catch (error) {
      console.error('Error liking person:', error);
    }
  };

  const dislikeAPerson = async (id: string) => {
    const email = session?.user.email;
    console.log(id, email);

    try {
      const response = await axios.post('http://localhost:3000/api/dislike', {
        email,
        userId: id,
      });

      console.log(response.data);
      handleNextUser()
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className='grid grid-cols-3'>
      <div className='col-span-1 w-[70vw]'>
        <Likedperson />
      </div>
      <div className="flex items-center justify-center top-0 bg-white relative col-span-2">
        <div className="relative flex flex-col items-center justify-center w-full max-w-md p-6 bg-gradient-to-r from-white to-blue-400 rounded-lg shadow-lg z-10">
          <div className="relative z-10 flex space-x-4 mb-6">
            <button
              onClick={() => handleGenderChange('male')}
              className={`px-4 py-2 rounded-lg ${gender === 'male' ? 'bg-blue-600' : 'bg-white'} hover:bg-blue-700 hover:text-white focus:outline-none`}
            >
              Male
            </button>
            <button
              onClick={() => handleGenderChange('female')}
              className={`px-4 py-2 rounded-lg ${gender === 'female' ? 'bg-pink-600' : 'bg-white'} hover:bg-pink-400 hover:text-white focus:outline-none`}
            >
              Female
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full p-4 rounded-lg shadow-lg">
            {users.length > 0 && (
              <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem key={users[currentIndex].email}>
                  <div className="p-1">
                    <Card className="flex items-center justify-center h-full">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="relative w-full h-64">
                          <img
                            src={users[currentIndex].photos[photoIndex]}
                            alt={`${users[currentIndex].username}'s photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-xl font-bold">
                            {users[currentIndex].username}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious
                className=' hover:'
                onClick={handlePreviousPhoto}
                disabled={photoIndex === 0}
              />
              <CarouselNext
                onClick={handleNextPhoto}
                disabled={photoIndex === users[currentIndex].photos.length - 1}
              />
            </Carousel>
            )}

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => dislikeAPerson(users[currentIndex]._id)}
                className="px-4 py-2 bg-white rounded-lg hover:bg-red-500 focus:outline-none"
              >
                ❌
              </button>
              <button
                onClick={handlePreviousUser}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-white rounded-lg hover:bg-gray-600 focus:outline-none"
              >
                Previous User
              </button>
              <button
                onClick={handleNextUser}
                disabled={currentIndex === users.length - 1}
                className="px-4 py-2 bg-white rounded-lg hover:bg-gray-600 focus:outline-none"
              >
                Next User
              </button>
              <button
                onClick={() => likeAPerson(users[currentIndex].email)}
                className="px-4 py-2 bg-white rounded-lg hover:bg-red-500 focus:outline-none"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarouselDemo;