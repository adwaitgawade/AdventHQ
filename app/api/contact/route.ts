import { NextResponse } from "next/server";

/**
 * Stubbed contact endpoint. Validates the payload and logs it.
 * TODO: wire to email/CRM (Resend, Postmark, HubSpot, etc.).
 */

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message?: string;
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "Name is required";
  if (!body.email?.trim() || !isEmail(body.email)) errors.email = "Valid email required";
  if (!body.message?.trim()) errors.message = "Tell us a little about the project";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // TODO: wire to email/CRM — for now just log the lead.
  console.log("[AdventHQ] New project enquiry:", {
    name: body.name,
    email: body.email,
    company: body.company ?? "—",
    projectType: body.projectType ?? "—",
    budget: body.budget ?? "—",
    message: body.message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
