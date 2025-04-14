import { plansMap } from "@/lib/constants";
import getDBConnection from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { doesUserExist, getPlanType, hasCancelledSubscription, updateUser } from "@/lib/user-helpers";
import { BgGradient } from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";



export default async function Dashboard(){
    
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0].emailAddress ?? "";

    const sql = await getDBConnection();

    let userId = null;
    let planType = 'starter';

    

    const hasUserCancelled = await hasCancelledSubscription(sql,email);
    const user = await doesUserExist(sql,email);


    if(user){

        userId = clerkUser?.id;

        if(userId){
            await updateUser(sql, userId, email);
        }
        

        const priceId = user[0].price_id;
        planType = getPlanType(priceId)
    }
   

    const isBasicPlan = planType === "basic";
    const isProPlan = planType === "pro";

    const db = getDBConnection();
    return (
        <BgGradient>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <Badge>{planType} Plan</Badge>
                </div>
            </div>
        </BgGradient>
    );
}