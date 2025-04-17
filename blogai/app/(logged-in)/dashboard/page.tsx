import { plansMap } from "@/lib/constants";
import getDBConnection from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { doesUserExist, getPlanType, hasCancelledSubscription, updateUser } from "@/lib/user-helpers";
import { BgGradient } from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/Upload/upgradeYourPlan";
import UploadForm from "@/components/Upload/uploadForm";
import { redirect } from "next/navigation";



export default async function Dashboard(){
    
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0].emailAddress ?? "";

    if(!clerkUser){
        return redirect("/sign-in")
    }

    const sql = await getDBConnection();

    let userId = null;
    let priceId = null; 

    

    const hasUserCancelled = await hasCancelledSubscription(sql,email);
    const user = await doesUserExist(sql,email);


    if(user){

        userId = clerkUser?.id;

        if(userId){
            await updateUser(sql, userId, email);
        }
        

        priceId = user[0].price_id;
       
    }
    const {id:planTypeId = "starter", name:planTypeName} = getPlanType(priceId);
        



    const isBasicPlan = planTypeId  === "basic";
    const isProPlan = planTypeId === "pro";

    const db = getDBConnection();
    return (
        <BgGradient>
            <div className="mx-auto max-w-7xl px-6 lg:py-20 py-14 lg:px-8">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white 
                        px-4 py-1 text-lg font-semibold capitalize rounded-2xl">
                        {planTypeName} Plan
                    </Badge>
                <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Start Create amazing content
                </h2>

                <p className="mt-2 text-lg leading-8 max-w-2xl text-gray-600 text-center">
                    Upload your audio or the video file and let our AI do the magic
                </p>

                <p className="mt-2 text-lg text-gray-600 max-w-2xl text-center">
                    You get{''} <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                    {isBasicPlan ? "3": "unlimited"}{" "}
                    blog posts</span>  as part of the {" "} 
                    <span className="font-bold capitalized">{planTypeName}</span>{" "}Plan.
                </p>
                {/*hasUserCancelled*/false ? <UpgradeYourPlan/>:(
                        <UploadForm/>
                    
                     )}
                
                </div>
            </div>
        </BgGradient>
    );
}