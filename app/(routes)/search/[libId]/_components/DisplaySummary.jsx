import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CheckCircle, AlertTriangle, Info, ExternalLink } from "lucide-react";

const DisplaySummary = ({ aiResp }) => {
  // Pre-process the response to convert plain text bullets to markdown lists
  // and handle other formatting for better display
  const processedResp = React.useMemo(() => {
    if (!aiResp) return "";
    return aiResp
      .split("\n")
      .map(line => {
        const trimmed = line.trim();
        // Convert • or * bullets to markdown list items
        if (trimmed.startsWith("•") || trimmed.startsWith("*")) {
          return `- ${trimmed.substring(1).trim()}`;
        }
        // Bold lines that look like headers (ending with :)
        if (trimmed.length > 0 && trimmed.endsWith(":") && !trimmed.startsWith("-")) {
          return `### ${trimmed}`;
        }
        return line;
      })
      .join("\n");
  }, [aiResp]);

  return (
    <div className="max-w-4xl mx-auto font-sans mt-8 mb-12">
      {!aiResp && (
        <div className="space-y-4 p-6 bg-white/50 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-full h-4 bg-gray-100 animate-pulse rounded-full"></div>
          <div className="w-3/4 h-4 bg-gray-100 animate-pulse rounded-full"></div>
          <div className="w-5/6 h-4 bg-gray-100 animate-pulse rounded-full"></div>
        </div>
      )}

      {aiResp && (
        <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100/80 backdrop-blur-sm prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold text-gray-900 mb-6 mt-8 pb-3 border-b border-gray-100 leading-tight tracking-tight"
                  {...props}
                />
              ),

              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-semibold text-gray-800 mb-4 mt-8 leading-snug tracking-tight"
                  {...props}
                />
              ),

              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-semibold text-gray-800 mt-6 mb-3 leading-snug"
                  {...props}
                />
              ),

              p: ({ node, ...props }) => (
                <p
                  className="text-gray-700 leading-relaxed mb-5 text-[1.05rem]"
                  {...props}
                />
              ),

              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 inline-flex items-center gap-0.5 border-b border-blue-200 hover:border-blue-600"
                  target="_blank"
                  rel="noreferrer"
                  {...props}
                >
                  {props.children}
                  <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                </a>
              ),

              ul: ({ node, ...props }) => (
                <ul
                  className="list-none space-y-2 leading-relaxed mb-6 pl-2"
                  {...props}
                />
              ),

              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal space-y-2 leading-relaxed mb-6 pl-6 text-gray-700"
                  {...props}
                />
              ),

              li: ({ node, ...props }) => (
                <li className="flex items-start gap-3" {...props}>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-500 mt-0.5 flex-shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </span>
                  <span className="flex-1 text-gray-700">{props.children}</span>
                </li>
              ),

              blockquote: ({ node, ...props }) => (
                <div className="my-6">
                  <blockquote
                    className="bg-gray-50/50 border-l-4 border-blue-400 py-4 px-6 rounded-r-xl text-gray-600 leading-relaxed italic"
                    {...props}
                  />
                </div>
              ),

              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 shadow-sm">
                  <table
                    className="min-w-full text-sm text-gray-700 border-collapse bg-white"
                    {...props}
                  />
                </div>
              ),

              thead: ({ node, ...props }) => (
                <thead className="bg-gray-50/80" {...props} />
              ),

              th: ({ node, ...props }) => (
                <th
                  className="border-b border-gray-200 px-6 py-3 text-left font-semibold text-gray-800 uppercase tracking-wider text-xs"
                  {...props}
                />
              ),

              td: ({ node, ...props }) => (
                <td className="border-b border-gray-100 px-6 py-4" {...props} />
              ),

              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <div className="bg-gray-50 px-4 py-2 text-gray-500 text-xs font-mono flex justify-between items-center border-b border-gray-200">
                      <span className="uppercase">{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: 0 }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },

              hr: () => <hr className="my-8 h-px bg-gray-100 border-0" />,

              div: ({ node, ...props }) => {
                if (props.className === "tip") {
                  return (
                    <div className="flex bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl mb-6">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mr-3 mt-0.5" />
                      <div className="text-emerald-800 font-medium">{props.children}</div>
                    </div>
                  );
                } else if (props.className === "warning") {
                  return (
                    <div className="flex bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl mb-6">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-3 mt-0.5" />
                      <div className="text-amber-800 font-medium">{props.children}</div>
                    </div>
                  );
                } else if (props.className === "info") {
                  return (
                    <div className="flex bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-6">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mr-3 mt-0.5" />
                      <div className="text-blue-800 font-medium">{props.children}</div>
                    </div>
                  );
                }
                return <div {...props} />;
              },
            }}
          >
            {processedResp}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default DisplaySummary;
