import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function processLists(text, isNested = false) {
  const lines = text.split("\n");
  let output = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    let olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (olMatch) {
      const baseIndent = olMatch[1].length;
      const olItems = [];
      while (i < lines.length) {
        const currLine = lines[i];
        const m = currLine.match(/^(\s*)(\d+)\.\s+(.*)/);
        if (!m || m[1].length !== baseIndent) break;
        let itemContent = m[3].trim();
        i++;
        const nestedLines = [];
        while (i < lines.length) {
          const nextLine = lines[i];
          const ulMatch = nextLine.match(/^(\s*)[-*]\s+(.*)/);
          if (nextLine.trim() === "") {
            nestedLines.push(nextLine);
            i++;
          } else if (ulMatch && ulMatch[1].length > baseIndent) {
            nestedLines.push(nextLine);
            i++;
          } else {
            break;
          }
        }
        if (nestedLines.length > 0) {
          const nestedBlock = processLists(nestedLines.join("\n"), true);
          itemContent += "\n" + nestedBlock;
        }
        olItems.push(`<li style="line-height: 2;">${itemContent}</li>`);
      }
      const marginStyle = isNested ? "0 0 0.8em 0" : "0.8em 0";
      output += `<ol style="margin: ${marginStyle}; padding-left: 2em;">\n${olItems.join(
        "\n"
      )}\n</ol>\n\n`;
      continue;
    }

    // Unordered list match
    let ulMatch = line.match(/^(\s*)[-*]\s+(.*)/);
    if (ulMatch) {
      const baseIndent = ulMatch[1].length;
      const ulItems = [];
      while (i < lines.length) {
        const currLine = lines[i];
        const m = currLine.match(/^(\s*)[-*]\s+(.*)/);
        if (!m || m[1].length !== baseIndent) break;
        let itemContent = m[2].trim();
        i++;
        const nestedLines = [];
        while (i < lines.length) {
          const nextLine = lines[i];
          const nestedMatch = nextLine.match(/^(\s*)[-*]\s+(.*)/);
          if (nextLine.trim() === "") {
            nestedLines.push(nextLine);
            i++;
          } else if (nestedMatch && nestedMatch[1].length > baseIndent) {
            nestedLines.push(nextLine);
            i++;
          } else {
            break;
          }
        }
        if (nestedLines.length > 0) {
          const nestedBlock = processLists(nestedLines.join("\n"), true);
          itemContent += "\n" + nestedBlock;
        }
        ulItems.push(`<li style="line-height: 2;">${itemContent}</li>`);
      }
      const marginStyle = isNested ? "0 0 0.8em 0" : "0.8em 0";
      output += `<ul style="margin: ${marginStyle}; padding-left: 2em;">\n${ulItems.join(
        "\n"
      )}\n</ul>\n\n`;
      continue;
    }

    output += line + "\n";
    i++;
  }
  return output;
}

/**
 * cleanupHTML: Remove empty tags, redundant consecutive <br /> tags, and extra whitespace.
 * Also removes unnecessary <br> tags after <li> and before closing </ul> or </ol> tags.
 */
function cleanupHTML(html) {
  // Remove empty tags (e.g., <p></p>, <strong></strong>, etc.)
  html = html.replace(/<(\w+)(\s[^>]*)?>\s*<\/\1>/g, "");

  // Remove <br> tags immediately after <ul> or <ol>
  html = html.replace(/(<(ul|ol)>)\s*(<br\s*\/?>\s*)+/g, "$1");

  // Remove <br> tags immediately after opening <li> tags
  html = html.replace(/<li>\s*(<br\s*\/?>\s*)+/g, "<li>");

  // Remove <br> tags immediately before closing </li>
  html = html.replace(/(<br\s*\/?>\s*)+(<\/li>)/g, "$2");

  // Remove <br> tags immediately before closing </ul> or </ol>
  html = html.replace(/(<br\s*\/?>\s*)+(<\/(ul|ol)>)/g, "$2");

  // Collapse multiple consecutive <br /> tags into one.
  html = html.replace(/(<br\s*\/?>\s*){2,}/g, "<br />");

  // Remove whitespace between tags.
  html = html.replace(/>\s+</g, "><");

  // Remove <p> tags that wrap block-level elements like lists.
  html = html.replace(/<p>\s*(<(ul|ol)[^>]*>[\s\S]*?<\/\2>)\s*<\/p>/g, "$1");

  return html;
}

function parseMarkdown(text, mode = "light") {
  const codeBlocks = [];
  text = text.replace(
    /```([\w-]+)?\n([\s\S]*?)```/g,
    (match, lang, codeContent) => {
      const languageLabel = lang ? lang.trim() : "";
      const trimmedCode = codeContent.trim();
      const escapedCode = escapeHtml(trimmedCode);
      const codeBlockHtml = `
      <div class="code-block" style="position: relative; margin: 1rem 0; border-radius: 20px; overflow: hidden;">
        ${
          languageLabel
            ? `<div class="code-block-header" style="background: ${
                mode === "dark" ? "#555" : "#eee"
              }; padding: 0.5rem 1.5rem; font-family: monospace; font-size: 0.8rem;">${languageLabel.toUpperCase()}</div>`
            : ""
        }
        <pre class="code-block-content" style="margin: 0; color: ${
          mode === "dark" ? "#f5f5f5" : "#555"
        }; background: ${
        mode === "dark" ? "#000" : "#f5f5f5"
      }; padding: 1.5rem; overflow: auto; font-family: monospace; line-height: 1.5;"><code>${escapedCode}</code></pre>
        <button class="copy-button" style="position: absolute; top: 10px; right: 10px; border: none; padding: 0.4rem; cursor: pointer; font-size: 1rem; background-color: transparent;">📋</button>
      </div>
    `;
      codeBlocks.push(codeBlockHtml);
      return `%%CODEBLOCK${codeBlocks.length - 1}%%`;
    }
  );

  text = text
    .replace(/&(?!#?\w+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  text = text.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headerText) => {
    const level = hashes.length;
    return `<hr style="margin: 1em 0; border: none; border-top: 1px solid #ddd;" /><h${level} style="margin: 0.8em 0;">${headerText}</h${level}>`;
  });

  text = text.replace(
    /^(?:\s*(?:-\s?){3,}|\s*(?:\*\s?){3,})$/gm,
    '<hr style="margin: 1em 0; border: none; border-top: 1px solid #ddd;" />'
  );

  text = text.replace(
    /^>\s+(.*)$/gm,
    '<blockquote style="margin: 0.8em 0; padding-left: 1em; border-left: 3px solid #eee;">$1</blockquote>'
  );

  text = processLists(text);
  text = text.replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  text = text.replace(
    /`([^`]+)`/g,
    '<code style="background: ' +
      (mode === "dark" ? "#333" : "#f5f5f5") +
      '; padding: 0.2em 0.4em; border-radius: 20px; font-family: monospace;">$1</code>'
  );

  text = text
    .split(/\n\s*\n/)
    .map((para) => {
      const trimmed = para.trim();
      if (trimmed === "") return "";
      if (trimmed.match(/^<\/?(h[1-6]|ul|ol|li|blockquote|pre|div|hr)/i)) {
        return para;
      }
      return `<p style="margin: 1em 0; line-height: 2;">${para.replace(
        /\n+/g,
        "<br />"
      )}</p>`;
    })
    .join("");

  codeBlocks.forEach((codeHtml, index) => {
    text = text.replace(`%%CODEBLOCK${index}%%`, codeHtml);
  });

  text = text.replace(/<hr[^>]*>(\s*<br\s*\/?>)+\s*<hr/g, "<br><hr");
  text = text.replace(/<br\s*\/?>\s*(<li)/g, "$1");
  text = text.trim();
  text = text.replace(/^(<hr[^>]*>\s*)+/, "");
  text = text.replace(/(\s*<hr[^>]*>)+$/, "");
  text = cleanupHTML(text);
  text = text.replace(/(<hr[^>]*>)(\s*<hr[^>]*>)+/g, "$1");

  return text;
}

const MarkdownRenderer = ({ markdown, mode }) => {
  const containerRef = useRef(null);

  const renderMarkdown = (text, mode) => {
    const lines = text.trim();
    if (lines === "") return "";
    return parseMarkdown(lines, mode);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buttons = container.querySelectorAll(".copy-button");
    function copyHandler(event) {
      const btn = event.currentTarget;
      const codeBlock = btn.closest(".code-block");
      if (!codeBlock) return;
      const codeElement = codeBlock.querySelector("pre.code-block-content code");
      if (!codeElement) return;
      const codeText = codeElement.textContent;
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = "✅";
          btn.style.color = "green";
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = "";
          }, 5000);
        })
        .catch((err) => {
          console.error("Copy failed: ", err);
        });
    }
    buttons.forEach((button) => {
      button.addEventListener("click", copyHandler);
    });
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", copyHandler);
      });
    };
  }, [markdown, mode]);

  return (
    <Box ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown, mode) }} />
    </Box>
  );
};

export default MarkdownRenderer;
