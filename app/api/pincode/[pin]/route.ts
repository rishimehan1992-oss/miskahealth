import { NextResponse } from "next/server";

type PincodePostOffice = {
  Name?: string;
  District?: string;
  State?: string;
  Country?: string;
};

type PincodeApiResponse = {
  Status?: string;
  Message?: string;
  PostOffice?: PincodePostOffice[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;
  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
    }

    const data = (await res.json()) as PincodeApiResponse[];
    const first = data[0];
    if (first?.Status !== "Success" || !first.PostOffice?.length) {
      return NextResponse.json({ found: false });
    }

    const office = first.PostOffice[0];
    return NextResponse.json({
      found: true,
      city: office.District ?? office.Name ?? "",
      state: office.State ?? "",
      country: office.Country ?? "India",
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
