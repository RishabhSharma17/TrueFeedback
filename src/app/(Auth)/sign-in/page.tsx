"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
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
    if(result?.ok){
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to resume your anonymous adventure</p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="email or username" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="*******" {...field} />
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
            New to the application?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
