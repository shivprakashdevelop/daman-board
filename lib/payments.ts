export type FixedPriceOrder = {
  campaignId: string;
  amountInr: number;
  ownerContact: string;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface PaymentAdapter {
  createPayment(order: FixedPriceOrder): Promise<{ status: PaymentStatus; reference?: string }>;
  verifyPayment(reference: string): Promise<{ status: PaymentStatus; reference: string }>;
  refundPayment(reference: string, reason: string): Promise<{ status: PaymentStatus; reference: string; reason: string }>;
}

/**
 * Safe fallback for the period before a card/UPI provider is approved.
 * The admin confirms the transfer reference; no payment is treated as paid by
 * the browser or by an auction-style pricing rule.
 */
export class ManualTransferAdapter implements PaymentAdapter {
  async createPayment(order: FixedPriceOrder) {
    return { status: "pending" as const, reference: `manual-${order.campaignId}` };
  }

  async verifyPayment(reference: string) {
    return { status: "pending" as const, reference };
  }

  async refundPayment(reference: string, reason: string) {
    return { status: "refunded" as const, reference, reason };
  }
}

export function getPaymentAdapter(): PaymentAdapter {
  // Replace this factory with the approved provider adapter server-side.
  // PAYMENT_PROVIDER is intentionally not read by client components.
  return new ManualTransferAdapter();
}
