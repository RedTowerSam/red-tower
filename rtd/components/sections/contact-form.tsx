"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SectionHeadline } from "@/components/ui/section-headline";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  // Honeypot field - should always be empty
  website: z.string().max(0, "Spam detected").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  
  // Track when form was first rendered (for time-based spam detection)
  const formLoadTime = React.useRef(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Calculate time since form was loaded (prevents instant bot submissions)
      const timeSinceLoad = Date.now() - formLoadTime.current;
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          timeSinceLoad, // Include time for server-side validation
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      reset(); // Clear the form
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative z-10 bg-fg text-bg w-full"
      data-background="light"
    >
      {/* Rounded Corner Transition */}
      <div className="relative z-12 bg-fg pt-0 pb-8 md:pb-14">
        <div className="bg-bg w-full h-12 md:h-28 rounded-bl-[80px] md:rounded-bl-[112px] rounded-br-[80px] md:rounded-br-[112px] shadow-clock" />
      </div>

      {/* Content wrapper - excludes rounded corners so headline unsticks naturally */}
      <div className="relative z-10 mt-16">
        {/* Section Headline */}
        <SectionHeadline
          title="Form"
          number="/01"
          codeLeft="function questions ( section (2), queries (8) ) {"
          variant="light"
          className="pt-9 md:pt-4"
        />

        {/* Form Section */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-16 lg:pt-24 pb-16 md:pb-56">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[32px] items-start lg:items-end">
              {/* Left Column - Content */}
              <div className="flex flex-col gap-8 w-full lg:w-[530px] shrink-0">
                {/* Heading */}
                <h2 className="font-header text-[56px] sm:text-[72px] md:text-[96px] leading-none tracking-[-0.03em] text-bg">
                  Bring your vision to life
                </h2>

                {/* Paragraph */}
                <p className="font-body font-light text-base md:text-lg lg:text-[20px] leading-[1.5] text-bg">
                  Contact Red Tower today to get started. We generally respond to requests for consultations within 1-2 business days. We look forward to hearing from you!
                </p>

                {/* Email */}
                <p className="font-header text-[24px] leading-none tracking-[-0.72px] text-bg">
                  Email:{" "}
                  <span className="text-accent">Hello@RedTowerDigital.com</span>
                </p>
              </div>

              {/* Right Column - Form */}
              <div className="flex-1 w-full flex flex-col gap-6">
                {/* Name and Email Inputs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <Input
                      label="Name"
                      type="text"
                      {...register("name")}
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-accent font-body">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Email"
                      type="email"
                      {...register("email")}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-accent font-body">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <Textarea
                    label="Message"
                    rows={5}
                    {...register("message")}
                    aria-invalid={errors.message ? "true" : "false"}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-accent font-body">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Honeypot field - hidden from users, bots will fill it */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    {...register("website")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Submit Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`font-body text-base ${
                      submitStatus.type === "success"
                        ? "text-green-600"
                        : "text-accent"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 self-end">
                  <Button
                    type="submit"
                    className="text-bg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Rounded Corner Transition (inverted) */}
      <div className="relative w-full">
        <div className="bg-fg h-28 w-full relative rotate-180">
          <div className="bg-bg h-12 md:h-28 rounded-bl-[80px] md:rounded-bl-[112px] rounded-br-[80px] md:rounded-br-[112px] shadow-clock w-full" />
        </div>
      </div>
    </section>
  );
}

