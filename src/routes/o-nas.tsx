import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o-nas")({
  head: () => ({
    meta: [
      { title: "O nas — historia Kawiarni Nocnej" },
      {
        name: "description",
        content:
          "Jak z nocnych wypałów w garażu powstała mała palarnia specialty w centrum Warszawy.",
      },
      { property: "og:title", content: "O nas — Kawiarnia Nocna" },
      {
        property: "og:description",
        content: "Historia małej palarni specialty prowadzonej przez dwie osoby.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">O nas</h1>
      <p className="text-muted-foreground">
        Zaczęliśmy w 2019 roku od jednego piecyka i nocnych wypałów, bo w dzień oboje pracowaliśmy
        gdzie indziej. Stąd nazwa — i stąd nawyk, że najlepsze rzeczy dzieją się po zmroku.
      </p>
      <p className="text-muted-foreground">
        Dziś palimy około 120 kg miesięcznie. To niewiele, ale pozwala nam znać każdą partię i
        rozmawiać z ludźmi, którzy tę kawę uprawiają.
      </p>
      <dl className="grid grid-cols-3 gap-6 border-t border-border pt-6">
        {[
          ["2019", "Pierwszy wypał"],
          ["3", "Kraje pochodzenia"],
          ["120 kg", "Miesięcznie"],
        ].map(([v, l]) => (
          <div key={l}>
            <dt className="text-2xl font-semibold">{v}</dt>
            <dd className="text-xs text-muted-foreground">{l}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
