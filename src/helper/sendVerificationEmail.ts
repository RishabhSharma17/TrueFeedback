import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    username:string,
    email:string,
    verifyCode:string,
) :Promise<ApiResponse> {
    console.log("sendVerificationEmail called with:", { username, email, verifyCode });

    try{

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "FeedBackApp | Verification Code",
            react: VerificationEmail ({username,otp:verifyCode}),
          });

          console.log("email sended successfully!")
        return {
            success:true,
            message:"Verification email sent successfully",
        }
    }
    catch(err){
        console.log("Error while sending verification mail :", err);

        return {
            success:false,
            message:"Failed to send an verification mail",
        }
    }
}
