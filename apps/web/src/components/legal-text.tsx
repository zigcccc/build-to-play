import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { CmsLinkValue, PortableTextValue } from '@/sanity/models';
import { CmsLink } from './cms-link';

type Table = { rows?: { _key: string; cells: string[] }[] };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3 className="font-semibold text-ink text-xl">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-[22px] marker:text-accent [&>li+li]:mt-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-[22px] marker:text-accent [&>li+li]:mt-2">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    // Italic is used for "[placeholder]" paragraphs until the lawyer supplies the text.
    em: ({ children }) => <em className="text-muted">{children}</em>,
    link: ({ value, children }) => (
      <CmsLink
        className="cursor-pointer text-accent underline underline-offset-2 hover:text-accent-hover"
        link={value as Omit<CmsLinkValue, 'label'>}
      >
        {children}
      </CmsLink>
    ),
  },
  types: {
    table: ({ value }: { value: Table }) => {
      const [head, ...rows] = value.rows ?? [];
      if (!head) return null;
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                {head.cells.map((cell) => (
                  <th
                    className="border-hairline border-b px-3.5 py-3 text-left font-medium text-muted text-xs uppercase tracking-[0.14em]"
                    key={cell}
                    scope="col"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._key}>
                  {row.cells.map((cell, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: table cells have no identity
                    <td className="border-hairline border-b px-3.5 py-3 align-top" key={i}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export function LegalText({ value }: { value: PortableTextValue }) {
  return <PortableText components={components} value={value as never} />;
}
