import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt i godziny otwarcia — Kawiarnia Nocna" },
      {
        name: "description",
        content: "Adres, godziny otwarcia i kontakt do Kawiarni Nocnej w Warszawie.",
      },
      { property: "og:title", content: "Kontakt — Kawiarnia Nocna" },
      {
        property: "og:description",
        content: "Adres, godziny otwarcia i dane kontaktowe kawiarni.",
      },
    ],
  }),
  component: Contact,
});

const hours = [
  ["Pon — Pt", "7:30 — 19:00"],
  ["Sobota", "9:00 — 18:00"],
  ["Niedziela", "10:00 — 16:00"],
];

function Contact() {
  return (
    <div className="grid max-w-3xl gap-10 sm:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Kontakt</h1>
        <p className="text-muted-foreground">
          ul. Wilcza 42<br />
          00-679 Warszawa
        </p>
        <p className="text-sm text-muted-foreground">
          czesc@kawiarnianocna.pl
          <br />
          +48 500 100 200
        </p>
      </div>
      <div>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Godziny</h2>
        <ul className="mt-4 space-y-3">
          {hours.map(([d, h]) => (
            <li key={d} className="flex justify-between border-b border-border pb-2 text-sm">
              <span>{d}</span>
              <span className="text-muted-foreground">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
