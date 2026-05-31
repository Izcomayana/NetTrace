import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import { StatsBar, CTA, Footer } from "./components/StatsAndCTA";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
