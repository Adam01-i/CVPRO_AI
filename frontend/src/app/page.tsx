import './../components/home/home-animations.css';
import { SiteHeader } from '@/components/home/site-header';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { ProblemTransformation } from '@/components/home/problem-transformation';
import { Workflow } from '@/components/home/workflow';
import { TemplateShowcase } from '@/components/home/template-showcase';
import { ColorShowcase } from '@/components/home/color-showcase';
import { EditorShowcase } from '@/components/home/editor-showcase';
import { AiShowcase } from '@/components/home/ai-showcase';
import { Personas } from '@/components/home/personas';
import { Features } from '@/components/home/features';
import { Testimonials } from '@/components/home/testimonials';
import { Faq } from '@/components/home/faq';
import { FinalCta } from '@/components/home/final-cta';
import { SiteFooter } from '@/components/home/site-footer';

export const metadata = {
  title: 'CVPro AI — Créez un CV professionnel en ligne',
  description:
    "CVPro AI transforme votre parcours en un CV professionnel, structuré et prêt à convaincre. Choisissez un modèle, personnalisez la couleur, visualisez le résultat en temps réel.",
};

export default function HomePage() {
  return (
    <div className="bg-[#0B1220]">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <ProblemTransformation />
        <Workflow />
        <TemplateShowcase />
        <ColorShowcase />
        <EditorShowcase />
        <AiShowcase />
        <Personas />
        <Features />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}