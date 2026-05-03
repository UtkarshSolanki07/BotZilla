import { runs } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { runId } = await req.json();
        
        const run = await runs.retrieve(runId);
        
        // Map Trigger status to what the frontend expects (Completed)
        const status = run.status === "COMPLETED" ? "Completed" : run.status;

        return NextResponse.json({ 
            data: [{ status: status }] 
        });
    } catch (error) {
        console.error("Error fetching Trigger status:", error.message);
        return NextResponse.json({ data: [] }, { status: 200 });
    }
}