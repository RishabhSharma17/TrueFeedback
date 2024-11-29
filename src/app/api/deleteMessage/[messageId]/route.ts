import { dbConnect } from "@/lib/dbConnected";
import { getServerSession, User } from "next-auth";
import { next_Options } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import mongoose from "mongoose";

export async function DELETE(req:Request,{params}:{params:{messageId:string}}){
    await dbConnect();
    const session = await getServerSession(next_Options);
    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "User not signed in"
        });
    }
    const user:User = session.user;

    try {
        const messageId = await params.messageId;
        const userId = new mongoose.Types.ObjectId(user._id);
        const existinguser = await UserModel.updateOne(
            {_id :  userId},
            {$pull: {message : {_id:messageId}}}
        )

        if(existinguser.modifiedCount===0){
            return Response.json({
                success: false,
                message: "Message not found"
            },{
                status:404
            });
        }

        return Response.json({
            success:true,
            message:"Message deleted successfully",
        },{status:200});

    } catch (error) {
        return Response.json({
            success: false,
            message: "An error occurred"
        },{
            status:500,
        })
    }
}