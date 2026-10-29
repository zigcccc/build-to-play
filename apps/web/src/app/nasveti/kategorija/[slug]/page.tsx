export function generateStaticParams() {
  return [{ slug: 'x' }];
}

export default function Page() {
  return <main className="wrap pt-40" data-hero />;
}
