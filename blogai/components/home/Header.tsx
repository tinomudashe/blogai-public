import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "./MenuIcon";
import { SignedIn, SignedOut, SignInButton, UserButton,SignOutButton } from "@clerk/nextjs";
import React from "react";
import { auth } from '@clerk/nextjs/server'
import { DialogTitle } from "@radix-ui/react-dialog";
import { BgGradient } from "../common/bg-gradient";




function NavLink({ href, children }: { href: string; children: React.ReactNode }){
  
  return (
    <Link
      href={href}
      className="text-lg font-semibold transition-colors duration-200 text-gray-600 hover:text-purple-500"
      prefetch={true}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800">
      {/* Logo */}

      <div className="lg:hidden flex-1 flex items-center justify-start z-50">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="lg:hidden flex-1 flex justify-center">
        <Link href="/" prefetch={false}>
          <Image
            className="w-24 h-auto"
            src="/blog5.png"
            alt="BlogAi"
            width={96}
            height={48}
          />
        </Link>
      </div>

      
      <div className="lg:hidden flex-1 flex justify-end">
      <div className="relative isolate">
        
          
            <Sheet >
            <SignedIn>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              </SignedIn>
              
              <SheetContent side="left">
                <DialogTitle className="hidden">Navigation Menu</DialogTitle>
                
                <div className="grid w-[200px] p-4 gap-3 ">
                  <UserButton />
                  <br/>
                  
                    <NavLink href="/">
                      <SheetClose asChild>
                        <span>Home</span>
                      </SheetClose>
                    </NavLink>

                    <NavLink href="/#pricing">
                      <SheetClose asChild>
                        <span>Pricing</span>
                      </SheetClose>
                    </NavLink>

                    <NavLink href="/#posts">
                      <SheetClose asChild>
                      <span>Posts</span>
                      </SheetClose>
                    </NavLink>
                    
                  
                    <div className="flex gap-2 items-center">
                      <NavLink href="/dashboard">
                        <SheetClose asChild>
                          <span>Upload Video</span>
                        </SheetClose>
                      </NavLink>
                    </div> 

                    <br/>

                    <SignOutButton>
                      <SheetClose asChild>
                      <Link 
                      href="/sign-in"
                      className="text-xl font-semibold transition-colors duration-200  text-purple-500 hover:text-gray-600"
                      prefetch={false}
                      >Sign out 
                      </Link>
                      </SheetClose>
                    </SignOutButton>

                </div>
                
              </SheetContent>
              
            </Sheet>
            
          
          
          </div>
      </div>

      <Link href="/" className="hidden md:flex items-center gap-2 shrink-0" prefetch={true}>
        <Image
          className="relative z-50 w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
          src="/blog5.png"
          alt="BlogAi"
          width={132}
          height={66}
        />
      </Link>


      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/#pricing">Pricing</NavLink>
        <NavLink href="/#posts">Posts</NavLink>
        <SignedIn>
          <div className="flex gap-2 items-center">
            <NavLink href="/dashboard">Upload Video</NavLink>
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Link
              href="/sign-in"
              className="text-lg font-semibold transition-colors duration-200  text-purple-500 hover:text-gray-600"
              prefetch={false}
            >
              Sign In
            </Link>
          </SignInButton>
        </SignedOut>
      </nav>

      {/* Mobile Menu */}
     
    </header>
  );
}