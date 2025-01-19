import UserModel from '@/model/user';
import { getServerSession } from 'next-auth/next';
import { dbConnect } from '@/lib/dbConnected';
import { User } from 'next-auth';
import { next_Options } from '../../auth/[...nextauth]/options';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid message ID format' },
      { status: 400 }
    );
  }

  await dbConnect();

  const session = await getServerSession(next_Options);
  const user: User = session?.user as User;

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
        { success: false, message: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}
