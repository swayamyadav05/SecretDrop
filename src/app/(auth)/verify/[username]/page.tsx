"use client";

import { useToast } from "@/app/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccountPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post<ApiResponse>(
        `/api/verify-code/`,
        {
          username: param.username,
          code: data.code,
        }
      );

      toast({
        title: "Account Verified!",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error verifying user:", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data?.message ||
          "Failed to verify account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="message-card-simple animate-mystery-slide">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent animate-glow flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Verify Your Account
            </h1>
            <p className="text-muted-foreground">
              We&apos;ve sent a 6-digit code to <br />
              <span className="font-medium text-foreground">
                your email
              </span>
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center">
                      Enter Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center items-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("🔢 OTP changed:", value);
                          }}>
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={0}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={1}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={2}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={3}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={4}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={5}
                              className="w-12 h-12 text-lg font-semibold border-2 border-primary/20 bg-background/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mystery-glow"
                disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Subimt Code"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
