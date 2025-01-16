import { dbConnect } from "@/lib/dbConnected";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { next_Options } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();
    const session = await getServerSession(next_Options);
    const user : User = session?.user;

    if(!session || !user){
        return Response.json({
            success:false,
            message:"User not signed in"
        },{
            status:500
        })
    }

    try {
        const userId = new mongoose.Types.ObjectId(user._id);
        const existinguser = await UserModel.aggregate([
                {$match : { _id:userId } },
                {$unwind: {path:'$message', preserveNullAndEmptyArrays: true }},
                {$sort:{'message.createdAt':-1}},
                {$group:{_id:"$_id",messages:{$push:'$message'}}},
        ]).exec();
        if(!existinguser || existinguser.length === 0){
            return Response.json({
                success:false,
                message:"User not found",
            },{
                status:404
            });
        }
        return Response.json({
            success:true,
            data:existinguser[0].messages
        },{
            status:200
        })

    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error while processing request",
        },{
            status:500
        })        
    }
}