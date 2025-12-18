export const AIModelsOption = [
  {
    id: 1,
    name: "Sonar",
    desc: "Perplexity fast model",
    modelApi: "",
  },
  {
    id: 2,
    name: "Claude 3.7",
    desc: "Smart model by Anthropic",
    modelApi: "",
  },
  {
    id: 3,
    name: "GPT-4.1",
    desc: "Powerful model by OpenAI",
    modelApi: "",
  },
  {
    id: 1,
    name: "Sonar",
    desc: "Perplexity fast model",
    modelApi: "",
  },
  {
    id: 4,
    name: "Gemini 2.5 Pro",
    desc: "Versatile model by Google",
    modelApi: "",
  },
  {
    id: 5,
    name: "Grok 3 Beta",
    desc: "xAI latest model",
    modelApi: "",
  },
];

// Shared function for link and share actions
export const handleAction = (actionType, record) => {
  const currentUrl = window.location.href;

  if (actionType === "link") {
    // Copy link to clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  } else if (actionType === "share") {
    // Share functionality (using Web Share API if available, else fallback)
    if (navigator.share) {
      navigator
        .share({
          title: record?.searchInput || record?.researchInput || "Shared Item",
          url: currentUrl,
        })
        .catch(console.error);
    } else {
      // Fallback: copy link and show message
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert("Link copied to clipboard! Share it manually.");
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
        });
    }
  }
};

// Function to extract content from record
const extractContent = (record) => {
  console.log("extractContent record:", record);
  if (!record?.Chats || record.Chats.length === 0) {
    console.log("No Chats found in record");
    return null;
  }

  const latestChat = record.Chats[record.Chats.length - 1];
  console.log("Latest chat:", latestChat);

  const title =
    record.searchInput || record.researchInput || "Exported Content";
  const aiResponse = latestChat.aiResp || "";
  const sources = latestChat.searchResult || [];

  if (!aiResponse) {
    console.log("No AI response found in latest chat");
  }

  return { title, aiResponse, sources };
};

// Export to PDF function
export const exportToPDF = (record) => {
  console.log("exportToPDF called with:", record);
  const content = extractContent(record);
  if (!content) {
    alert("No content available to export");
    return;
  }

  const { title, aiResponse, sources } = content;

  // Import jsPDF dynamically
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = 20;

    // Helper to check page break
    const checkPageBreak = (heightNeeded) => {
      if (yPosition + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // --- Title Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Blue

    const titleLines = doc.splitTextToSize(title, contentWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 8 + 5;

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    // --- AI Response Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // Dark gray
    doc.text("AI Response", margin, yPosition);
    yPosition += 10;

    // Parse and render plain text
    const lines = aiResponse.split("\n");

    lines.forEach((line) => {
      // Simple plain text rendering
      if (line.trim().length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);

        const splitText = doc.splitTextToSize(line, contentWidth);
        checkPageBreak(splitText.length * 5);
        doc.text(splitText, margin, yPosition);
        yPosition += splitText.length * 5 + 3;
      }
      // Empty lines
      else {
        yPosition += 4;
      }
    });

    yPosition += 10;

    // --- Sources Section ---
    if (sources.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text("Sources", margin, yPosition);
      yPosition += 8;

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      sources.forEach((source, index) => {
        checkPageBreak(40);

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        const sourceTitle = `${index + 1}. ${source.title}`;
        const titleLines = doc.splitTextToSize(sourceTitle, contentWidth);
        doc.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 5 + 3;

        // Snippet
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        const snippetLines = doc.splitTextToSize(source.snippet, contentWidth - 5);
        doc.text(snippetLines, margin + 5, yPosition);
        yPosition += snippetLines.length * 4 + 4;

        // URL
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(37, 99, 235);
        const urlLines = doc.splitTextToSize(source.url, contentWidth - 5);
        doc.textWithLink(urlLines[0], margin + 5, yPosition, { url: source.url });
        doc.setTextColor(0, 0, 0); // Reset color
        yPosition += 10;
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        margin,
        pageHeight - 10
      );
    }

    // Save
    const fileName = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
    doc.save(fileName);
  });
};

// Export to DOCX function
export const exportToDOCX = (record) => {
  const content = extractContent(record);
  if (!content) {
    alert("No content available to export");
    return;
  }

  const { title, aiResponse, sources } = content;

  // Import docx dynamically
  import("docx").then(
    ({
      Document,
      Packer,
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType,
      UnderlineType,
    }) => {
      // Helper to parse plain text to DOCX paragraphs
      const parsePlainTextToDocx = (text) => {
        const lines = text.split("\n");
        const paragraphs = [];

        lines.forEach((line) => {
          const trimmedLine = line.trim();

          if (trimmedLine.length > 0) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24,
                  })
                ],
                spacing: { after: 120 },
              })
            );
          } else {
            paragraphs.push(new Paragraph({ text: "" }));
          }
        });

        return paragraphs;
      };

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children: [
              // Title
              new Paragraph({
                text: title,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),

              // AI Response Header
              new Paragraph({
                children: [
                  new TextRun({ text: "AI Response", bold: true, size: 32 }),
                ],
                spacing: { before: 400, after: 200 },
              }),

              // AI Response Content
              ...parsePlainTextToDocx(aiResponse),

              // Sources Header
              ...(sources.length > 0
                ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Sources", bold: true, size: 32 }),
                    ],
                    spacing: { before: 600, after: 300 },
                  }),

                  // Sources Content
                  ...sources.flatMap((source, index) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${index + 1}. ${source.title}`,
                          bold: true,
                          size: 26,
                          color: "3B82F6", // Blue color
                        }),
                      ],
                      spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: source.snippet,
                          size: 22,
                          color: "6B7280", // Medium gray
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: source.url,
                          size: 22,
                          color: "2563EB", // Blue color
                          underline: { type: UnderlineType.SINGLE },
                        }),
                      ],
                      spacing: { after: 200 },
                    }),
                  ]),
                ]
                : []),

              // Footer
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generated on ${new Date().toLocaleDateString()}`,
                    size: 18,
                    color: "9CA3AF", // Light gray
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    }
  );
};
