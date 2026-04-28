import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Solution } from '@/components/Solution';
import { Rules } from '@/components/Rules';
import { GetStarted } from '@/components/GetStarted';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <Rules />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
}
