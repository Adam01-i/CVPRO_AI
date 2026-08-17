const ITEMS = [
  { icon: '🧭', label: 'Création guidée' },
  { icon: '⚡', label: 'Aperçu en temps réel' },
  { icon: '🎨', label: 'Modèles professionnels' },
  { icon: '📄', label: 'Export PDF' },
  { icon: '🤖', label: 'Assistant IA' },
];

export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-[#0B1220] py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-5 px-4 sm:px-8">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}