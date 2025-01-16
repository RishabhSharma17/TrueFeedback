'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className=''>
      <div className='p-4 shadow-md flex justify-between'>
        <Link href="/" className=' text-center text-2xl font-bold ml-7 my-1'>
          TrueFeedback
        </Link>
        <div className='flex gap-10'>
          <Link href='/' className='text-lg mt-2'>
          Home
          </Link>
          <Link href='/dashboard' className='text-lg mt-2'>
          Dashboard
          </Link>
          <Link href={`/u/${user?.username}`} className='text-lg mr-8 mt-2'>
          MessagePage
          </Link>
          {
            session ? (
              <div className='mr-8 flex gap-6'>
                <div className='mt-2 '><span className='text-xl text-blue-400'>{user.username}</span></div>
                <Button onClick={() => signOut()} className='w-full  text-lg md:w-auto bg-slate-100 text-black' variant='outline' >Logout</Button>
              </div>
            ) : (
              <div className='mr-10 flex gap-2'>
                <Link href="/sign-in">
                <Button className="w-full md:w-auto border border-black rounded-lg px-3 py-1 text-lg bg-slate-100 text-black" variant='outline' >Signin</Button>
                </Link>
                <span className='text-4xl'> / </span>
                <Link href="/sign-up">
                <Button className="w-full md:w-auto border border-black rounded-lg px-3 py-1 text-lg bg-slate-100 text-black" variant='outline' >Signup</Button>
                </Link>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;