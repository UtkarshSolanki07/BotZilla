import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { searchInput, searchType } = body;

  // Shared NewsAPI search function
  const performNewsSearch = async (query) => {
    try {
      const newsApiUrl = "https://newsapi.org/v2/everything";
      const params = {
        apiKey: process.env.NEWS_API_KEY,
        q: query, // Removed quotes to allow more flexible matching for complex prompts

        language: "en",
        sortBy: "relevancy", // Prioritize relevance over recency
        pageSize: 10,
        page: 1,
      };

      const response = await axios.get(newsApiUrl, { params });

      const results = response.data.articles.slice(0, 10);


      // Transform to Google Custom Search format
      return results.map((article) => ({
        title: article.title,
        link: article.url,
        displayLink: article.source.name,
        snippet:
          article.description || article.content?.substring(0, 200) + "...",
        formattedUrl: article.url,
        pagemap: {
          cse_thumbnail: article.urlToImage
            ? [{ src: article.urlToImage }]
            : [],
          cse_image: article.urlToImage ? [{ src: article.urlToImage }] : [],
          metatags: [
            {
              "og:image": article.urlToImage,
              "article:published_time": article.publishedAt,
              "og:description": article.description,
              author: article.author,
            },
          ],
        },
        author: article.author,
        publishedAt: article.publishedAt,
        source: article.source,
      }));
    } catch (error) {
      console.error("NewsAPI Error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Handle image search with Google Custom Search
  if (searchType === "image") {
    const params = {
      key: process.env.GOOGLE_API_KEY,
      cx: process.env.CX,
      q: searchInput,
      searchType: "image",
    };

    return axios
      .get("https://www.googleapis.com/customsearch/v1", {
        params,
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })
      .then((res) => NextResponse.json(res.data.items || []))
      .catch((error) => {
        console.error(
          "Image Search Error:",
          error.response?.data || error.message,
        );
        return NextResponse.json(
          { error: "Image search failed" },
          { status: 500 },
        );
      });
  }

  // Handle news search with NewsAPI (using shared function)
  if (searchType.toLowerCase() === "search") {
    try {
      const results = await performNewsSearch(searchInput);
      return NextResponse.json(results);
    } catch (error) {
      console.error("NewsAPI Error:", error.response?.data || error.message);

      // Return helpful error message
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: "Invalid NewsAPI key" },
          { status: 401 },
        );
      } else if (error.response?.status === 426) {
        return NextResponse.json(
          { error: "NewsAPI rate limit exceeded" },
          { status: 426 },
        );
      }

      return NextResponse.json(
        { error: "News search failed" },
        { status: 500 },
      );
    }
  }

  // Handle research search with Google Custom Search
  if (searchType.toLowerCase() === "research") {
    try {
      const params = {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.CX,
        q: searchInput,
        num: 10, // More results for research
      };

      const response = await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params,
          headers: {
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
          },
        },
      );

      // Transform Google Custom Search response
      const transformedResults = response.data.items.map((item) => ({
        title: item.title,
        link: item.link,
        displayLink: item.displayLink,
        snippet: item.snippet,
        formattedUrl: item.formattedUrl,
        pagemap: item.pagemap,
      }));

      return NextResponse.json(transformedResults);
    } catch (error) {
      const googleError = error.response?.data || error.message;
      console.error("Google Custom Search failed:", googleError);

      // Fallback to NewsAPI on 403 PERMISSION_DENIED
      if (
        error.response?.status === 403 ||
        googleError.includes("PERMISSION_DENIED")
      ) {
        console.log("🔄 Falling back to NewsAPI for research...");
        try {
          const newsResults = await performNewsSearch(searchInput);
          console.log("✅ NewsAPI fallback successful");
          return NextResponse.json(newsResults.slice(0, 10));
        } catch (fbError) {
          console.error(
            "NewsAPI fallback also failed:",
            fbError.response?.data || fbError.message,
          );
          return NextResponse.json(
            {
              error: "Both search APIs failed. Please check your API keys.",
              googleError: googleError.error?.message,
            },
            { status: 500 },
          );
        }
      }

      return NextResponse.json(
        {
          error: "Research search failed",
          googleDetails: googleError,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
}
