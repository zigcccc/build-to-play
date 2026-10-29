import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

/** Site chrome for every public page; the coming-soon page (app/kmalu) stands alone without it. */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
