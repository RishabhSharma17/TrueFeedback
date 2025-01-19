import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import dayjs from 'dayjs';
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../types/ApiResponse";
import { Message } from "@/model/user";
  
type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId:string) => void;
}

export default function MessageCard ({message, onMessageDelete}:MessageCardProp) {
    const { toast } = useToast();
    const handleDelete = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/deleteMessage`,{
              data: {messageId: message?._id}
            });
            toast({
                title: response.data.message,
            });
            onMessageDelete(message?._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }

    };
    return (
        <Card className="card-bordered">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="" variant='destructive'>
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </div>
        </CardHeader>
      </Card>
    );
}
  