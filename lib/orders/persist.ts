import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  getOrderByRazorpayIdFromSupabase,
  getOrderFromSupabase,
  saveOrderToSupabase,
} from "./supabase";
import { getOrderById, getOrderByRazorpayOrderId, saveOrder } from "./store";
import type { OrderRecord } from "./types";

export async function persistOrder(order: OrderRecord, userId?: string | null) {
  if (isSupabaseAdminConfigured()) {
    await saveOrderToSupabase({ ...order, userId: userId ?? order.userId }, userId);
  }
  await saveOrder(order);
}

export async function fetchOrderById(id: string): Promise<OrderRecord | null> {
  if (isSupabaseAdminConfigured()) {
    const fromDb = await getOrderFromSupabase(id);
    if (fromDb) return fromDb;
  }
  return (await getOrderById(id)) ?? null;
}

export async function fetchOrderByRazorpayId(razorpayOrderId: string): Promise<OrderRecord | null> {
  if (isSupabaseAdminConfigured()) {
    const fromDb = await getOrderByRazorpayIdFromSupabase(razorpayOrderId);
    if (fromDb) return fromDb;
  }
  return (await getOrderByRazorpayOrderId(razorpayOrderId)) ?? null;
}
