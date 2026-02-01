import resend from "@/config/email";

export const verifyEmail = async (to: string, token: string) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      template: {
        id: "order-confirmation",
        variables: {
          PRODUCT: "Vintage Macintosh",
          PRICE: 499,
        },
      },
    });
  } catch (error) {
    console.error("Failed to send verification email", {
      to,
      error,
    });
    throw new Error("Email verification send failed");
  }
};
