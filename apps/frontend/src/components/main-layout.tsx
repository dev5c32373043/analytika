import { Header } from './header';

export function MainLayout({ children }) {
  return (
    <section className="flex flex-col items-center">
      <Header />
      {children}
    </section>
  );
}
