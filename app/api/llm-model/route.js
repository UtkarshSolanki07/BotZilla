import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(req){
    const {searchInput,searchResult,recordId}=await req.json();

    const handle = await tasks.trigger("llm-model", {
        searchInput: searchInput,
        searchResult: searchResult,
        recordId: recordId
    });

    return NextResponse.json(handle.id);

}