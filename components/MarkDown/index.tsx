/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { LinkRenderer } from "./LinkRenderer";

const CustomMarkdown = ({ markdownContent }: any) => {
  return (
    <ReactMarkdown
      components={{
        // Links with custom renderer
        a: LinkRenderer,

        // Code blocks with syntax highlighting
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              style={atomDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        // Headings with proper styling
        h1: ({ node, children, ...props }) => (
          <h1 className="text-2xl font-bold my-4" {...props}>
            {children}
          </h1>
        ),
        h2: ({ node, children, ...props }) => (
          <h2 className="text-xl font-bold my-3" {...props}>
            {children}
          </h2>
        ),
        h3: ({ node, children, ...props }) => (
          <h3 className="text-lg font-bold my-2" {...props}>
            {children}
          </h3>
        ),

        // Lists
        ul: ({ node, children, ...props }) => (
          <ul className="list-disc ml-6 my-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({ node, children, ...props }) => (
          <ol className="list-decimal ml-6 my-2" {...props}>
            {children}
          </ol>
        ),

        // Paragraphs
        p: ({ node, children, ...props }) => (
          <p className="my-2" {...props}>
            {children}
          </p>
        ),

        // Blockquotes
        blockquote: ({ node, children, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-2"
            {...props}
          >
            {children}
          </blockquote>
        ),

        // Tables
        table: ({ node, children, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ node, children, ...props }) => (
          <thead className="bg-gray-100" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ node, children, ...props }) => (
          <tbody className="divide-y divide-gray-200" {...props}>
            {children}
          </tbody>
        ),
        tr: ({ node, children, ...props }) => (
          <tr className="hover:bg-gray-50" {...props}>
            {children}
          </tr>
        ),
        th: ({ node, children, ...props }) => (
          <th className="px-4 py-2 text-left font-medium" {...props}>
            {children}
          </th>
        ),
        td: ({ node, children, ...props }) => (
          <td className="px-4 py-2" {...props}>
            {children}
          </td>
        ),

        // Horizontal rule
        hr: ({ node, ...props }) => (
          <hr className="my-4 border-t border-gray-300" {...props} />
        ),

        // Strong and emphasis
        strong: ({ node, children, ...props }) => (
          <strong className="font-bold" {...props}>
            {children}
          </strong>
        ),
        em: ({ node, children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),

        // Images
        img: ({ node, ...props }) => (
          <img
            className="max-w-full h-auto my-4 rounded"
            {...props}
            alt={props.alt || ""}
          />
        ),
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;
