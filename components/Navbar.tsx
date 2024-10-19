'use client';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Link from 'next/link';
import React from 'react';

import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky w-full h-14 inset-x-0 top-0  z-30 border-b border-gray-200 bg-white/75 transition-all backdrop-blur-lg">
      <div className="max-container">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="text-black font-semibold flex z-40">
            AskMy<span className="text-indigo-600">PDF</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}
                href={'/pricing'}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}
              >
                SignIn
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  variant: 'default',
                  size: 'sm',
                })}
              >
                Get started
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </RegisterLink>
            </>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
