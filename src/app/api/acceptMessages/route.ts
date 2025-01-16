import { dbConnect } from '@/lib/dbConnected';
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { next_Options } from "../auth/[...nextauth]/options";

export async function POST(req:Request){
    await dbConnect();
    const session = await getServerSession(next_Options);
    const user : User = session?.user as User;

    console.log(user)
    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"User not signed in"
        },{
            status:401
        })
    }

    try {
        const {acceptMessages} = await req.json();
        const userId = user._id;

        const updatedUser = await UserModel.findByIdAndUpdate(
             userId,
            { isAccepting:acceptMessages },
            { new:true },
        );

        if(!updatedUser){
            return Response.json({
                success:false,
                message: 'User not found',
            })
        }

        return Response.json(
            {
              success: true,
              message: 'Message acceptance status updated successfully',
              updatedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message: 'Error while processing request',
        },{status:500})
    }

}

export async function GET() {
    // Connect to the database
    await dbConnect();
  
    // Get the user session
    const session = await getServerSession(next_Options);
    const user = session?.user;
  
    // Check if the user is authenticated
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    try {
      // Retrieve the user from the database using the ID
      const foundUser = await UserModel.findById(user._id);
  
      if (!foundUser) {
        // User not found
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
  
      // Return the user's message acceptance status
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAccepting,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving message acceptance status:', error);
      return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
      );
    }
  }