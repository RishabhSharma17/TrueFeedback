"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(true);
    const { toast } = useToast();

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptMessages");

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>("/api/acceptMessages");
            setValue("acceptMessages", response.data.isAcceptingMessages);
        } catch (error) {
            const axioserror = error as AxiosError<ApiResponse>;
            console.error(axioserror);
            toast({
                title: "Error",
                description:
                    axioserror?.response?.data?.message ??
                    "Failed to fetch message settings",
                variant: "destructive",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            try {
                const response = await axios.get("/api/getMessages");
                setMessages(response.data?.data);
                if (refresh) {
                    toast({
                        title: "Refreshed Messages",
                        description: "Showing latest messages",
                    });
                }
            } catch (error) {
                const axioserror = error as AxiosError<ApiResponse>;
                console.error(axioserror);
                toast({
                    title: "Error",
                    description:
                        axioserror?.response?.data?.message ||
                        "Failed to fetch messages",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [toast]
    );
    console.log(messages);
    useEffect(() => {
        if (session?.user) {
            fetchMessages();
            fetchAcceptMessages();
        }
    }, [session, fetchMessages, fetchAcceptMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/acceptMessages", {
                acceptMessages: !acceptMessages,
            });
            setValue("acceptMessages", !acceptMessages);
            toast({
                title: response.data.message,
                variant: "default",
            });
        } catch (error) {
            const axioserror = error as AxiosError;
            console.error(axioserror);
            toast({
                title: "Error",
                description: "Failed to update message settings",
                variant: "destructive",
            });
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((m) => m._id !== messageId));
    };

    const username = (session?.user as User)?.username;
    const [profileUrl, setProfileUrl] = useState("");

    // Calculate profile URL on the client
    useEffect(() => {
        if (typeof window !== "undefined") {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            setProfileUrl(`${baseUrl}/u/${username}`);
        }
    }, [username]);

    const copyToClipboard = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard
                .writeText(profileUrl)
                .then(() => {
                    toast({
                        title: "URL Copied!",
                        description: "Profile URL has been copied to clipboard.",
                    });
                })
                .catch((error) => {
                    console.error("Failed to copy text: ", error);
                    toast({
                        title: "Error",
                        description: "Failed to copy profile URL.",
                        variant: "destructive",
                    });
                });
        }
    };

    if (!session) {
        return (
            <p className="flex justify-center h-screen text-xl items-center">
                You are not logged in.
            </p>
        );
    }

    if (isLoading) {
        return <Loader2 className="animate-spin mx-auto" />;
    }

    return (
        <div className="my-8 mx-2 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-5xl font-bold mb-10">User Dashboard</h1>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-3">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator className="mb-3" />

            <Button
                className="mt-4 mb-2"
                variant="outline"
                onClick={() => fetchMessages(true)}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={(message?._id as string | number) || index}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}
