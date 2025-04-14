
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const NavLink = ({href,children}:{href:string, children:React.ReactNode}) =>{
    return <Link
    href={href}
    className='font-bold lg:text-lg md:text-md sm:text-2xl transition-colors duration-200 text-gray-600 hover:text-purple-500'
    >
        {children}
    </Link>
}

export default function Header(){

    return (<nav className='container flex items-center justify-between
    px-8 py-4 mx-auto'>
    <div className="flex lg:flex-1 ">
    <NavLink href="/">

        <span className='flex items-center gap-2 shrink-0'>
            <Image 
                className="relative z-50 w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
                src='/blog5.png'
                alt='BlogAi'
                width={132}
                height={66}
            />
        </span>
    </NavLink>
    </div>
    <div className='flex lg:justify-center gap-2 lg:gap-12 lg:items-center
    '>
        <NavLink href="/#pricing">Pricing</NavLink>
        <SignedIn>
        <NavLink href="/#posts">Posts</NavLink>
        </SignedIn>
        

    </div>
    <div className="flex lg:justify-end lg:flex-1">
        
        <SignedIn>
            <div className="flex gap-2 items-center">
                <NavLink href="/dashboard">Upload Video</NavLink>
                {/** Profile */}
            
                <UserButton />
            </div>
        </SignedIn>
        

           
    </div>
        
    </nav>);
}