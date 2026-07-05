"use client";

export default function PaddleCheckoutButton({
  priceId,
  customData,
  children,
  className,
  style,
}: {
  priceId: string;
  customData?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  function abrir() {
    if (typeof window !== "undefined" && window.Paddle) {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData,
      });
    }
  }

  return (
    <button type="button" onClick={abrir} className={className} style={style}>
      {children}
    </button>
  );
}
