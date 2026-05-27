export type PincodeLookup = {
  found: boolean;
  city?: string;
  state?: string;
  country?: string;
};

export async function lookupPincode(pin: string): Promise<PincodeLookup> {
  if (!/^\d{6}$/.test(pin)) return { found: false };
  const res = await fetch(`/api/pincode/${pin}`);
  if (!res.ok) return { found: false };
  return (await res.json()) as PincodeLookup;
}
