import { Fragment, type ReactNode } from "react";

/**
 * Markdown-lite for content fields: **bold**, *italic*, __underline__,
 * [text](url) and newlines. Parsed straight to React elements — never HTML
 * strings — so content from the database can't inject markup. Links only
 * render for http(s)/mailto hrefs; anything else stays plain text.
 *
 * Used by both the public site and the admin editor's live preview, so what
 * you see in the dashboard is exactly what visitors get.
 */

const TOKEN =
  /(\*\*(.+?)\*\*|__(.+?)__|\*([^*\n]+?)\*|\[([^\]\n]+)\]\(([^)\s]+)\))/;

const SAFE_HREF = /^(https?:\/\/|mailto:)/i;

function parseInline(text: string, keyPrefix: string, links: boolean): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;

  while (rest) {
    const match = rest.match(TOKEN);
    if (!match || match.index === undefined) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) nodes.push(rest.slice(0, match.index));

    const k = `${keyPrefix}.${key++}`;
    const [token, , bold, underline, italic, linkText, href] = match;
    if (bold !== undefined) {
      nodes.push(<strong key={k}>{parseInline(bold, k, links)}</strong>);
    } else if (underline !== undefined) {
      nodes.push(<u key={k}>{parseInline(underline, k, links)}</u>);
    } else if (italic !== undefined) {
      nodes.push(<em key={k}>{parseInline(italic, k, links)}</em>);
    } else if (linkText !== undefined && href !== undefined) {
      if (links && SAFE_HREF.test(href)) {
        nodes.push(
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-brd2 underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit"
          >
            {parseInline(linkText, k, links)}
          </a>
        );
      } else {
        nodes.push(<Fragment key={k}>{parseInline(linkText, k, links)}</Fragment>);
      }
    }

    rest = rest.slice(match.index + token.length);
  }

  return nodes;
}

/** `links={false}` renders link text without the anchor — for contexts already
 *  wrapped in an <a> (nested anchors are invalid HTML). */
export function Markup({ text, links = true }: { text: string; links?: boolean }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {parseInline(line, `l${i}`, links)}
        </Fragment>
      ))}
    </>
  );
}

/** Plain-text version for truncated one-line previews (bento cards etc.). */
export function stripMarkup(text: string): string {
  return text
    .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*([^*\n]+?)\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}
