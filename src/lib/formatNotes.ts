// utils/formatNotes.ts
export function formatNotes(notes: string): string {
  if (!notes) return "";

  const lines = notes.split("\n").filter((line) => line.trim() !== "");
  let html = "";

  for (const line of lines) {
    const trimmed = line.trim();

    // Section headers: lines ending with nothing but look like titles (all words, no punctuation at end except colon)
    if (trimmed.endsWith(":") || /^[A-Z][^a-z]*$/.test(trimmed)) {
      html += `<p class="font-bold text-card-foreground mt-3 mb-1">${trimmed}</p>`;
    }
    // Bullet-like lines (already have dash or dot)
    else if (/^[-•*]/.test(trimmed)) {
      html += `<li class="ml-4 text-muted-foreground text-sm">${trimmed.replace(/^[-•*]\s*/, "")}</li>`;
    }
    // Plain text lines — treat as bullet points under current section
    else {
      html += `<li class="ml-4 text-muted-foreground text-sm">${trimmed}</li>`;
    }
  }

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="list-disc list-inside space-y-1">${match}</ul>`;
  });

  return html;
}