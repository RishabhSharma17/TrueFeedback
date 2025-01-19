import mongoose from "mongoose";

type connected = {
    isConnected?:number;
}

const connection : connected = {}

export async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || '');
        connection.isConnected = db.connections[0].readyState;
        return
    }
    catch(err){
        console.log("Some error occurred while connecting to database : ",err);

        process.exit(1);
    }
}