import React from 'react';
import { slugify } from '../lib/journalService';

interface ArticleBodyRendererProps {
  body: string;
  largeText?: boolean;
}

function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={keyCounter++} className="font-semibold text-[#0A0A0A] dark:text-[#F5F4F0]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      tokens.push(
        <em key={keyCounter++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code
          key={keyCounter++}
          className="font-mono text-[0.875em] px-1.5 py-0.5 bg-[#F1EFEA] dark:bg-[#1C1C19] border border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}

export function extractArticleHeadings(body: string): { id: string; text: string }[] {
  return body
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '').trim();
      return { id: slugify(text), text };
    });
}

export function ArticleBodyRenderer({ body, largeText = false }: ArticleBodyRendererProps) {
  const lines = body.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let renderedFirstParagraph = false;

  const textSizeClass = largeText ? 'text-lg sm:text-[19px]' : 'text-base sm:text-[17px]';

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Fenced code / architectural diagram block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={`code-${i}`}
          className="my-7 p-4 sm:p-5 overflow-x-auto border border-[#0A0A0A] dark:border-[#F5F4F0]/30 bg-[#F1EFEA] dark:bg-[#151513] font-mono text-xs sm:text-[13px] leading-relaxed text-[#0A0A0A] dark:text-[#F5F4F0]"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // H2 Heading
    if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '').trim();
      blocks.push(
        <h2
          id={slugify(text)}
          key={`h2-${i}`}
          className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-12 mb-4 pt-6 border-t-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] text-balance scroll-mt-24"
        >
          {text}
        </h2>
      );
      i += 1;
      continue;
    }

    // H3 Heading
    if (line.startsWith('### ')) {
      const text = line.replace(/^###\s+/, '').trim();
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-8 mb-3 text-balance"
        >
          {text}
        </h3>
      );
      i += 1;
      continue;
    }

    // Pull quote / blockquote
    if (line.trim().startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="my-8 py-6 px-4 border-y-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] text-center font-display italic text-2xl sm:text-3xl leading-relaxed text-[#0A0A0A] dark:text-[#F5F4F0]"
        >
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim());
        i += 1;
      }
      const parseRow = (row: string) =>
        row
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(tableRows[0]);
      const dataRows = tableRows.slice(2).map(parseRow);

      blocks.push(
        <div
          key={`table-${i}`}
          className="my-8 overflow-x-auto border border-[#0A0A0A] dark:border-[#F5F4F0]/35 bg-white dark:bg-[#151513]"
        >
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-[#F1EFEA] dark:bg-[#1C1C19]">
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] dark:text-[#F5F4F0]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/15 dark:divide-[#F5F4F0]/15">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="align-top">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-3 px-4 text-[#0A0A0A]/85 dark:text-[#D4D2CC] leading-relaxed"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul
          key={`ul-${i}`}
          className={`my-5 pl-6 list-disc space-y-2.5 leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] ${textSizeClass}`}
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className={`my-5 pl-6 list-decimal space-y-2.5 leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] ${textSizeClass}`}
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Standard Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i += 1;
    }

    const isFirst = !renderedFirstParagraph;
    renderedFirstParagraph = true;

    blocks.push(
      <p
        key={`p-${i}`}
        className={`my-5 leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] ${textSizeClass} ${
          isFirst ? 'editorial-drop-cap' : ''
        }`}
      >
        {renderInline(paraLines.join(' '))}
      </p>
    );
  }

  return <div className="max-w-prose">{blocks}</div>;
}
