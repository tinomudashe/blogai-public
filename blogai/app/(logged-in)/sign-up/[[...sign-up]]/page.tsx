import { BgGradient } from '@/components/common/bg-gradient';
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (<BgGradient><section className='flex justify-center items-center py-16'>
    <SignUp />
  </section></BgGradient>);
}