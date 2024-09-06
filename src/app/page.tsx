'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import one from '../../public/one.jpg';
import two from '../../public/two.jpg';  // Fixed the image name here
import three from '../../public/three.jpg';  // Fixed the image name here

export default function Home() {
  const images = [
    { image: one },
    { image: two },
    { image: three },
  ];

  return (
    <>
      <main className="flex items-center justify-center p-0 m-0">
        <div className="relative w-full h-[91vh] flex flex-col lg:flex-row">
          
          {/* Left Side - Content */}
          <div className="relative flex flex-col h-[91vh] justify-center items-center lg:items-start w-full lg:w-1/2 p-6 lg:p-12 bg-white/0 sm:bg-transparent z-10">
            <div className="max-w-xl text-center lg:text-left bg-white rounded bg-opacity-50 justify-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Let us find you
                <strong className="block mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  A Date
                </strong>
              </h1>

              <p className="mt-4 max-w-lg text-base sm:text-lg lg:text-xl text-gray-700">
                Hey, developer! Can&apos;t find anyone who loves you? Don&apos;t worry, we&apos;ve got you covered.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <a
                  href="/dashboard"
                  className="block w-full sm:w-auto rounded bg-[#eb65c2] px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500"
                >
                  Get Started
                </a>

                <a
                  href="#"
                  className="block w-full sm:w-auto rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Carousel */}
          <div className="relative flex justify-center items-center w-full lg:w-1/2 bg-white">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={img.image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-[]object-cover"
                      width={500}
                      height={500}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
            </Carousel>
          </div>

          {/* Background Image for Small Screens */}
          {/* <div
            className="absolute inset-0 lg:hidden bg-[url(https://res.cloudinary.com/dfjfjovut/image/upload/v1724144036/chttkagiyggqh97ws9c6.png)] bg-cover bg-center bg-no-repeat"
          ></div>
          <div
            className="hidden lg:block lg:w-1/2 h-full bg-[url(https://res.cloudinary.com/dfjfjovut/image/upload/v1724144036/chttkagiyggqh97ws9c6.png)] bg-cover bg-center bg-no-repeat"
          ></div> */}
        </div>
      </main>
      <div>
        {/* Additional content can be added here */}
      </div>
    </>
  );
}
