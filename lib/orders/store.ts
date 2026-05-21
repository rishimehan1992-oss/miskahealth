import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { OrderRecord } from "./types";

/** Vercel/serverless: only `/tmp` is writable; local dev uses `.data/`. */
function ordersFilePath() {
  if (process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp/miska-orders.json";
  }
  return path.join(process.cwd(), ".data", "orders.json");
}

async function readAll(): Promise<OrderRecord[]> {
  const file = ordersFilePath();
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: OrderRecord[]) {
  const file = ordersFilePath();
  const dir = path.dirname(file);
  try {
    if (dir !== "/tmp") {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(file, JSON.stringify(orders, null, 2), "utf8");
  } catch (err) {
    console.warn("Order store write skipped:", err);
  }
}

/** Best-effort persistence — never throws (safe on Vercel). */
export async function saveOrder(order: OrderRecord) {
  try {
    const orders = await readAll();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) orders[idx] = order;
    else orders.push(order);
    await writeAll(orders);
  } catch (err) {
    console.warn("saveOrder failed:", err);
  }
}

export async function getOrderById(id: string) {
  const orders = await readAll();
  return orders.find((o) => o.id === id);
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string) {
  const orders = await readAll();
  return orders.find((o) => o.razorpayOrderId === razorpayOrderId);
}

export async function updateOrderStatus(
  razorpayOrderId: string,
  patch: Partial<Pick<OrderRecord, "status" | "paymentId" | "paidAt">>
) {
  try {
    const orders = await readAll();
    const idx = orders.findIndex((o) => o.razorpayOrderId === razorpayOrderId);
    if (idx < 0) return null;
    orders[idx] = { ...orders[idx], ...patch };
    await writeAll(orders);
    return orders[idx];
  } catch {
    return null;
  }
}
