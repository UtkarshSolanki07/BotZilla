import { supabase } from "@/app/Supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { insertData } = body;

        const { data, error } = await supabase
            .from("Library")
            .insert([insertData])
            .select();

        if (error) {
            console.error("Error inserting library record:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error in create-search API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
