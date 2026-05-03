import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { researchInput, researchResult, recordId, libId } =
    await req.json();

  const handle = await tasks.trigger("llm-research-model", {
    researchInput: researchInput,
    researchResult: researchResult,
    recordId: recordId,
    libId: libId,
  });

  return NextResponse.json(handle.id);
}

