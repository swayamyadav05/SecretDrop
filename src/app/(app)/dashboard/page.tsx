"use client";
import { useToast } from "@/app/hooks/use-toast";
import { MessageCard } from "@/components/MessageCard";
import ShareLinkCard from "@/components/ShareLinkCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ClientMessage } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Mail, MessageCircle } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashboardPage = () => {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter(
        (message) => message._id.toString() !== messageId
      )
    );
    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox",
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id.toString() === messageId
          ? { ...msg, isRead: true }
          : msg
      )
    );
  };

  const { data: session } = useSession();

  const user = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        "/api/accept-message"
      );
      setValue(
        "acceptMessages",
        response.data.isAcceptingMessages ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(
          "/api/get-messages"
        );

        const clientMessages: ClientMessage[] =
          response.data.messages?.map((message) => ({
            _id: String(message._id),
            content: message.content,
            createdAt: String(message.createdAt),
            isRead: message.isRead,
          })) || [];

        setMessages(clientMessages);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-message",
        { acceptMessage: !acceptMessages }
      );
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto pt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="message-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <MessageCircle className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : messages.length}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Total Messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="message-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : unreadCount}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Unread Messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="message-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    TODO: Total Public Profile Visit Count
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Profile Views
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/** Left Column - Messages */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Your Secret Drop Box
              </h2>
              {unreadCount > 0 && (
                <Badge
                  variant={"secondary"}
                  className="bg-accent/20 text-accent">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <Card className="message-card">
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Loading messages...
                    </p>
                  </CardContent>
                </Card>
              ) : messages.length > 0 ? (
                messages.map((message, index) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onDelete={handleDeleteMessage}
                    onMarkAsRead={handleMarkAsRead}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))
              ) : (
                <Card className="message-card">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No messages yet. Share your link to start
                      receiving secret messages!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/** Right Column - Controls */}
          <div className="space-y-6">
            {/** Message Settings */}
            <Card className="message-card">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Message Receiving
                </CardTitle>
                <Badge
                  variant={acceptMessages ? "secondary" : "default"}
                  className={
                    acceptMessages ? "" : "bg-primary/20 text-primary"
                  }>
                  {acceptMessages ? "Allowed" : "Blocked"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Switch
                      {...register("acceptMessages")}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                      className="shadow-primary"
                    />
                    <p className="font-medium">Accept Messages</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to send you messages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/** Share Link */}
            <ShareLinkCard username={user?.username ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
