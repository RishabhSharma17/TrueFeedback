import { dbConnect } from "@/lib/dbConnected";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(req:Request){
    await dbConnect();

    try {
        const{username,content} = await req.json();
        const user = await UserModel.findOne({username: username});
        const messagecontent = (content.trim()).toString();
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status:404
            });
        }

        if(!user.isAccepting){
            return Response.json({
                success: false,
                message: "User is not accepting feedback",
            },{
                status:403
            });
        }

        const newMessage = {
            content:messagecontent,
            createdAt: new Date(),
        };

        user.message.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Feedback registered successfully",
            messages: user.message,
        },{
            status:201
        });

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error while registering message",
        },{
            status:500
        })
    }
}