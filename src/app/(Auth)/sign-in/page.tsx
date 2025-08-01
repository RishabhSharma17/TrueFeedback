"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
    });
    console.log(result)
    if(result?.error){
        toast({
            title: 'Sign In Failed',
            description:"Incorrect username or password",
            variant:'destructive'
        })
    }
    setIsSubmitting(false);
    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <p className="font-semibold border-2 border-gray-300 p-2 rounded-md text-sm">
        <span className="text-gray-600">Username:</span> <span className="text-blue-600">test</span> | 
        <span className="text-gray-600"> Password:</span> <span className="text-blue-600">test@123</span>
        </p>
          <br/>
            <div className="border-4 border-red-500 text-red-600 bg-red-100 p-4 rounded-lg font-semibold">
              If you encounter any errors on the next page, simply refresh to continue smoothly.
            </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to resume your anonymous adventure</p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </FormProvider>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
