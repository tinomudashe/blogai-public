
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function UpgradeYourPlan(){
  return (
    <div className='flex flex-col items-center justify-center gap-6 text-center'>

        <p className="mt-2 text-lg leading-8 max-w-2xl text-gray-600 text-center boarder-2 border-red-200 bg-red-100 p-4 rounded-lg border-dashed">
            You need to upgrade to the Basic Plan or the Pro Plan to create blog posts with blogAI
        </p>
        <Link
            href="/#pricing"
            className="flex gap-2 items-center text-purple-600 font-semibold">
                Go to pricing <ArrowRight className="w-4 h-4"/>
        </Link>
    </div>
  )
}

