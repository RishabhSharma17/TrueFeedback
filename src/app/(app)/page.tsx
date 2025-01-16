'use client';
import Autoplay from 'embla-carousel-autoplay';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import messages from '@/message.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className='h-screen'>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 h-5/6 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      <footer className="bg-gray-900 text-white py-8 md:p-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row md:justify-between md:space-x-6">
            <div className="text-center md:text-left">
              <p className="text-sm">
                © 2024 True Feedback. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center space-x-4">
              <a href="#" className="text-sm hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-gray-400">Terms of Service</a>
              <a href="#" className="text-sm hover:text-gray-400">Contact Us</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Made with ❤️ by the True Feedback Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
