import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { OrderRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<OrderRecord[]> {
  try {
    const raw = await readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: OrderRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: OrderRecord) {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = order;
  else orders.push(order);
  await writeAll(orders);
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
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.razorpayOrderId === razorpayOrderId);
  if (idx < 0) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeAll(orders);
  return orders[idx];
}
