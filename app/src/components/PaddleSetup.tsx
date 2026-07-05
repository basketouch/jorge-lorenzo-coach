"use client";

import Script from "next/script";

declare global {
  interface Window {
    Paddle: {
      Setup: (opts: { token: string }) => void;
      Checkout: {
        open: (opts: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, unknown>;
        }) => void;
      };
    };
  }
}

export default function PaddleSetup() {
  return (
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      onLoad={() => {
        window.Paddle.Setup({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        });
      }}
    />
  );
}
