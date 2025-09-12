"use client";
import { useToast } from "@/app/hooks/use-toast";
import { MessageCard } from "@/components/MessageCard";
import ShareLinkCard from "@/components/ShareLinkCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashboardPage = () => {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const CACHE_DURATION = 2 * 60 * 1000;

  const [isPolling, setIsPolling] = useState(false);
  const POLL_INTERVAL = 5000;

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 4;

  const { toast } = useToast();

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document
      .querySelector("#message-card")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id.toString() !== messageId)
    );
    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox",
    });
  };

  const handleMarkAsRead = async (messageId: string) => {
    const wasRead =
      messages.find((m) => m._id.toString() === messageId)?.isRead ??
      false;

    if (wasRead) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id.toString() === messageId
          ? { ...msg, isRead: true }
          : msg
      )
    );

    try {
      const response = await axios.patch(
        `/api/messages/${messageId}/read`
      );
      if (!response.data.success) {
        throw new Error("Failed to mark as read");
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id.toString() === messageId
            ? { ...msg, isRead: wasRead }
            : msg
        )
      );
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    }
  };

  const { data: session, status } = useSession();

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

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-message",
        { acceptMessages: !acceptMessages }
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

  const smartFetchMessages = useCallback(async () => {
    const now = Date.now();
    const cacheAge = now - lastFetch;

    if (!isInitialLoad && cacheAge < CACHE_DURATION) {
      console.log(
        `Using cached messages (age: ${Math.round(cacheAge / 1000)}s)`
      );
      setIsLoading(false);
      return;
    }

    console.log("Fetching fresh messages...");

    try {
      setIsLoading(true);
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
      setLastFetch(now);
      setIsInitialLoad(false);
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
      setIsLoading(false);
    }
  }, [lastFetch, isInitialLoad, CACHE_DURATION, toast]);

  const fetchNewMessages = useCallback(async () => {
    if (isPolling || isLoading) return;

    setIsPolling(true);
    try {
      const response = await axios.get<ApiResponse>(
        "/api/get-messages"
      );

      const freshMessages: ClientMessage[] =
        response.data.messages?.map((message) => ({
          _id: String(message._id),
          content: message.content,
          createdAt: String(message.createdAt),
          isRead: message.isRead,
        })) || [];

      const currentIds = new Set(messages.map((m) => m._id));
      const freshIds = new Set(freshMessages.map((m) => m._id));
      const newOnes = freshMessages.filter(
        (m) => !currentIds.has(m._id)
      );
      const removed = messages.filter((m) => !freshIds.has(m._id));

      if (newOnes.length || removed.length) {
        setMessages(freshMessages);
        if (newOnes.length) {
          const newCount = newOnes.length;
          toast({
            title: `${newCount} new message${newCount > 1 ? "s" : ""}`,
            description: "You have received new secret messages!",
            duration: 4000,
          });
        }
      }
    } catch (error) {
      console.log("Background polling failed:", error);
    } finally {
      setIsPolling(false);
    }
  }, [isPolling, isLoading, messages, toast]);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "unauthenticated") {
      setIsLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user) {
      smartFetchMessages();
      fetchAcceptMessage();
    }
  }, [status, session?.user, smartFetchMessages, fetchAcceptMessage]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNewMessages();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [status, session?.user, fetchNewMessages]);

  useEffect(() => {
    if (messages.length > 0 && currentPage > 1) {
      const totalPagesNew = Math.ceil(
        messages.length / messagesPerPage
      );
      if (currentPage > totalPagesNew) {
        setCurrentPage(1);
      }
    }
  }, [messages.length]);

  return (
    <div className="min-h-screen px-6">
      <div className="max-w-6xl mx-auto mb-4">
        <div className="mb-4">
          <h1 className="text-lg font-medium text-foreground/90">
            Welcome,{" "}
            <span className="text-primary font-semibold">
              {user?.username}
            </span>
          </h1>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="message-card h-fit">
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

        <div
          id="message-card"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/** Left Column - Messages */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Your Secret Drop Box
              </h2>
              {unreadCount > 0 ? (
                <Badge
                  variant={"secondary"}
                  className="bg-accent/20 text-accent">
                  {unreadCount} unread
                </Badge>
              ) : (
                <Badge
                  variant={"secondary"}
                  className="bg-accent/20 text-accent">
                  All read
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
                currentMessages.map((message, index) => (
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
          <div className="lg:mt-13 space-y-6">
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

        {/* Pagination Control */}
        <div className="grid grid-cols-3">
          <div className="col-span-3 lg:col-span-2 gap-2">
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 px-2">
                <Button
                  variant={"outline"}
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                  className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {currentPage > 1 && unreadCount > 0 && (
                    <Button
                      variant={"secondary"}
                      size={"sm"}
                      onClick={() => handlePageChange(1)}
                      className="text-xs px-3 py-1">
                      Latest Message
                    </Button>
                  )}
                  {/* </div> */}

                  {/* <div className="flex items-center gap-2 text-sm text-muted-foreground"> */}
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Badge variant={"secondary"} className="text-xs">
                    {messages.length} total
                  </Badge>
                </div>

                <Button
                  variant={"outline"}
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className="flex items-center gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
