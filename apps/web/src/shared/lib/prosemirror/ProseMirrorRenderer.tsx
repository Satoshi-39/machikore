/**
 * ProseMirror JSONをHTMLとしてレンダリング（Server Component対応）
 *
 * モバイル版 RichTextRenderer.tsx のWeb版移植
 * 全ての画像はSupabase Storage経由のため next/image を使用
 */

import Image from "next/image";
import type { ProseMirrorDoc, ProseMirrorNode } from "@/shared/types";

type ProseMirrorRendererProps = {
  content: ProseMirrorDoc | null | undefined;
  className?: string;
};

export function ProseMirrorRenderer({
  content,
  className,
}: ProseMirrorRendererProps) {
  if (!content || !content.content || content.content.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {content.content.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: ProseMirrorNode }) {
  switch (node.type) {
    case "paragraph":
      return <ParagraphNode node={node} />;
    case "heading":
      return <HeadingNode node={node} />;
    case "bulletList":
      return <BulletListNode node={node} />;
    case "orderedList":
      return <OrderedListNode node={node} />;
    case "listItem":
      return <ListItemNode node={node} />;
    case "blockquote":
      return <BlockquoteNode node={node} />;
    case "codeBlock":
      return <CodeBlockNode node={node} />;
    case "horizontalRule":
      return <hr className="my-6 border-border" />;
    case "hardBreak":
      return <br />;
    case "image":
      return <ImageNode node={node} />;
    case "embed":
      return <EmbedNode node={node} />;
    default:
      if (node.content) {
        return (
          <div>
            {node.content.map((child, index) => (
              <RenderNode key={index} node={child} />
            ))}
          </div>
        );
      }
      return null;
  }
}

function ParagraphNode({ node }: { node: ProseMirrorNode }) {
  if (!node.content || node.content.length === 0) {
    return <div className="h-6" />;
  }

  return (
    <p className="text-sm leading-relaxed text-foreground mb-2">
      <RenderInlineContent content={node.content} />
    </p>
  );
}

function HeadingNode({ node }: { node: ProseMirrorNode }) {
  const level = (node.attrs?.level as number) || 2;

  const Tag = level === 1 ? "h2" : level === 2 ? "h2" : "h3";
  const className =
    level <= 2
      ? "text-lg font-bold mb-3 mt-6"
      : "text-base font-semibold mb-2 mt-4";

  return (
    <Tag className={className}>
      {node.content && <RenderInlineContent content={node.content} />}
    </Tag>
  );
}

function BulletListNode({ node }: { node: ProseMirrorNode }) {
  if (!node.content) return null;

  return (
    <ul className="list-disc pl-6 mb-3 space-y-1">
      {node.content.map((item, index) => (
        <RenderNode key={index} node={item} />
      ))}
    </ul>
  );
}

function OrderedListNode({ node }: { node: ProseMirrorNode }) {
  if (!node.content) return null;

  return (
    <ol className="list-decimal pl-6 mb-3 space-y-1">
      {node.content.map((item, index) => (
        <RenderNode key={index} node={item} />
      ))}
    </ol>
  );
}

function ListItemNode({ node }: { node: ProseMirrorNode }) {
  if (!node.content) return null;

  return (
    <li className="text-sm leading-relaxed">
      {node.content.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </li>
  );
}

function BlockquoteNode({ node }: { node: ProseMirrorNode }) {
  if (!node.content) return null;

  return (
    <blockquote className="border-l-4 border-border pl-4 my-4 text-muted-foreground italic">
      {node.content.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </blockquote>
  );
}

function CodeBlockNode({ node }: { node: ProseMirrorNode }) {
  const code = node.content?.map((n) => n.text || "").join("") || "";

  return (
    <pre className="bg-secondary rounded-lg p-4 mb-3 overflow-x-auto">
      <code className="text-sm font-mono">{code}</code>
    </pre>
  );
}

function ImageNode({ node }: { node: ProseMirrorNode }) {
  const src = node.attrs?.src as string | undefined;
  if (!src) return null;

  return (
    <figure className="my-4 relative aspect-[4/3]">
      <Image
        src={src}
        alt=""
        fill
        className="rounded-lg object-cover"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </figure>
  );
}

function EmbedNode({ node }: { node: ProseMirrorNode }) {
  const provider = node.attrs?.provider as string | undefined;
  const embedId = node.attrs?.embedId as string | undefined;
  const url = node.attrs?.url as string | undefined;
  const ogTitle = node.attrs?.ogTitle as string | undefined;
  const ogDescription = node.attrs?.ogDescription as string | undefined;
  const thumbnailUrl = node.attrs?.thumbnailUrl as string | undefined;

  if (!provider) return null;

  switch (provider) {
    case "youtube":
      if (!embedId) return null;
      return (
        <div className="my-4 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${embedId}`}
            title="YouTube"
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case "x":
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block rounded-lg border p-4 hover:bg-accent transition-colors"
        >
          <p className="text-sm text-primary">X (Twitter) の投稿を見る</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
        </a>
      );

    case "instagram":
      if (!embedId) return null;
      return (
        <div className="my-4 flex justify-center">
          <iframe
            src={`https://www.instagram.com/p/${embedId}/embed/`}
            title="Instagram"
            className="w-full max-w-[540px] rounded-lg border-0"
            style={{ minHeight: 500 }}
            loading="lazy"
          />
        </div>
      );

    case "link_card":
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 flex items-start gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium line-clamp-2">
              {ogTitle || url}
            </p>
            {ogDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {ogDescription}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {new URL(url).hostname}
            </p>
          </div>
        </a>
      );

    default:
      if (!url) return null;
      return (
        <div className="my-4 aspect-video">
          <iframe
            src={url}
            title={provider}
            className="w-full h-full rounded-lg"
            loading="lazy"
          />
        </div>
      );
  }
}

function RenderInlineContent({ content }: { content: ProseMirrorNode[] }) {
  return (
    <>
      {content.map((node, index) => {
        if (node.type === "text") {
          return <RenderTextNode key={index} node={node} />;
        }
        if (node.type === "hardBreak") {
          return <br key={index} />;
        }
        return null;
      })}
    </>
  );
}

function RenderTextNode({ node }: { node: ProseMirrorNode }) {
  if (!node.text) return null;

  let element: React.ReactNode = node.text;

  if (node.marks) {
    for (const mark of node.marks) {
      switch (mark.type) {
        case "bold":
          element = <strong>{element}</strong>;
          break;
        case "italic":
          element = <em>{element}</em>;
          break;
        case "underline":
          element = <u>{element}</u>;
          break;
        case "strike":
          element = <s>{element}</s>;
          break;
        case "code":
          element = (
            <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono">
              {element}
            </code>
          );
          break;
        case "link": {
          const href = mark.attrs?.href as string | undefined;
          element = (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              {element}
            </a>
          );
          break;
        }
      }
    }
  }

  return <>{element}</>;
}
