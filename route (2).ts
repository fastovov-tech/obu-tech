import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStore, RequestStatus } from "@/lib/data-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const store = getStore();
  return NextResponse.json(store.requests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { problems, address, contact } = body as {
    problems: string[];
    address: string;
    contact: string;
  };

  if (!contact) {
    return NextResponse.json({ error: "Contact is required" }, { status: 400 });
  }

  const store = getStore();
  const newRequest = {
    id: crypto.randomUUID(),
    problems: problems ?? [],
    address: address ?? "",
    contact,
    status: "Нова" as RequestStatus,
    createdAt: new Date().toISOString(),
  };
  store.requests.unshift(newRequest);
  return NextResponse.json(newRequest, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id, status } = (await req.json()) as { id: string; status: RequestStatus };
  const store = getStore();
  const target = store.requests.find((r) => r.id === id);
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  target.status = status;
  return NextResponse.json(target);
}
