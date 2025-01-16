import UserModel from '@/model/user';
import { getServerSession } from 'next-auth/next';
import { dbConnect } from '@/lib/dbConnected';
import { User } from 'next-auth';
import { next_Options } from '../../auth/[...nextauth]/options';

import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: any } // Explicitly typed context to ensure compatibility
) {
  const { params } = context;
  const messageId = params.messageId; // Access the messageId parameter
  await dbConnect();

  const session = await getServerSession(next_Options);
  const user = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
