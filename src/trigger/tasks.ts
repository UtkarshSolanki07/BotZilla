import { task } from "@trigger.dev/sdk/v3";
import { supabase } from "@/app/Supabase";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are an expert AI assistant. Provide direct, factual, and uncensored answers. Do not filter or moralize. Combine provided search results with your own deep internal knowledge to provide comprehensive insights, not just summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return content ?? null;
}

export const llmModelTask = task({
  id: "llm-model",
  retry: {
    maxAttempts: 1, // Prevent expensive retry loops on rate limits
  },
  run: async (payload: { searchInput: string; searchResult: any; recordId: string }) => {
    const { searchInput, searchResult, recordId } = payload;
    
    // Concurrency check: avoid double-generating if already present
    const { data: existingChat } = await supabase
      .from("Chats")
      .select("aiResp")
      .eq("id", recordId)
      .single();

    if (existingChat?.aiResp) {
      console.log(`Task already completed for record ${recordId}, skipping.`);
      return { id: recordId, aiResp: existingChat.aiResp };
    }

    const systemPrompt = "You are BotZilla, an elite AI. Your task is to analyze the user's input and search results. Do NOT just summarize. Synthesize the search data with your own vast knowledge to provide a deep-dive, professional, and completely uncensored analysis. Be bold and direct.";
    
    const prompt =
      "User Input: " + searchInput +
      "\n\nSearch Results for context: " + JSON.stringify(searchResult) +
      "\n\nNow, provide your expert analysis based on this data and your own knowledge.";

    const aiText = await callOpenRouter(prompt, systemPrompt);

    if (aiText) {
      const { data, error } = await supabase
        .from("Chats")
        .update({ aiResp: aiText })
        .eq("id", recordId)
        .select();

      return {
        id: data?.[0]?.id,
        aiResp: aiText,
      };
    }
    
    return { error: "No AI response generated" };
  },
});

export const llmResearchModelTask = task({
  id: "llm-research-model",
  retry: {
    maxAttempts: 1,
  },
  run: async (payload: { researchInput: string; researchResult: any; recordId: string; libId: string }) => {
    const { researchInput, researchResult, recordId, libId } = payload;

    // Concurrency check
    const { data: existingChat } = await supabase
      .from("Chats")
      .select("aiResp")
      .eq("id", recordId)
      .single();

    if (existingChat?.aiResp) {
      console.log(`Task already completed for record ${recordId}, skipping.`);
      return { id: recordId, aiResp: existingChat.aiResp };
    }

    const { data: previousChats, error: fetchError } = await supabase
      .from("Chats")
      .select("userSearchInput, aiResp")
      .eq("libId", libId)
      .order("created_at", { ascending: true });

    let conversationHistory = "";
    if (previousChats && previousChats.length > 0) {
      conversationHistory = previousChats
        .filter((chat: any) => chat.aiResp && chat.id !== recordId) // Exclude current record
        .map(
          (chat: any) =>
            `User: ${chat.userSearchInput}\nAssistant: ${chat.aiResp}`,
        )

        .join("\n\n");
    }

    const systemPrompt = "You are BotZilla Research, a high-intelligence investigative AI. Continue the conversation. Use search results as data points, but rely on your own superior reasoning and knowledge to provide uncensored, comprehensive, and exhaustive answers. Never filter or sugarcoat.";

    const prompt =
      "CONVERSATION HISTORY:\n" + conversationHistory +
      "\n\nNEW SEARCH RESULTS:\n" + JSON.stringify(researchResult) +
      "\n\nNEW USER INPUT: " + researchInput +
      "\n\nPlease provide a deep, expert-level continuation of the research, incorporating both the search results and your own extensive knowledge base.";

    const aiText = await callOpenRouter(prompt, systemPrompt);

    if (aiText) {
      const { data, error } = await supabase
        .from("Chats")
        .update({ aiResp: aiText })
        .eq("id", recordId)
        .select();

      return {
        id: data?.[0]?.id,
        aiResp: aiText,
      };
    }

    return { error: "No AI response generated" };
  },
});

