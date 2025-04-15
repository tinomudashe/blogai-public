import { BgGradient } from '@/components/common/bg-gradient';
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (<BgGradient><section className='flex justify-center items-center py-16'>
    <SignIn />
  </section></BgGradient>);
}