import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStore, ServiceItem, FaqItem } from "@/lib/data-store";

export async function GET() {
  const store = getStore();
  return NextResponse.json({ services: store.services, faq: store.faq });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await req.json()) as {
    services?: ServiceItem[];
    faq?: FaqItem[];
  };
  const store = getStore();
  if (body.services) store.services = body.services;
  if (body.faq) store.faq = body.faq;
  return NextResponse.json({ services: store.services, faq: store.faq });
}
