import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu i ceny — Kawiarnia Nocna" },
      {
        name: "description",
        content: "Espresso, filter, ziarna na wynos. Aktualne menu i ceny w Kawiarni Nocnej.",
      },
      { property: "og:title", content: "Menu i ceny — Kawiarnia Nocna" },
      {
        property: "og:description",
        content: "Espresso, filter i ziarna na wynos — aktualna karta kawiarni.",
      },
    ],
  }),
  component: Menu,
});

const groups = [
  {
    name: "Espresso bar",
    items: [
      ["Espresso", "9 zł"],
      ["Flat white", "16 zł"],
      ["Cortado", "13 zł"],
    ],
  },
  {
    name: "Filter",
    items: [
      ["V60 — Etiopia Guji", "18 zł"],
      ["Batch brew", "12 zł"],
      ["Cold brew", "15 zł"],
    ],
  },
  {
    name: "Ziarna 250 g",
    items: [
      ["Nocny blend", "52 zł"],
      ["Kolumbia Huila", "64 zł"],
      ["Peru decaf", "58 zł"],
    ],
  },
];

function Menu() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Menu</h1>
        <p className="text-muted-foreground">Karta zmienia się co kilka tygodni.</p>
      </header>
      <div className="grid gap-8 sm:grid-cols-3">
        {groups.map((g) => (
          <section key={g.name}>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{g.name}</h2>
            <ul className="mt-4 space-y-3">
              {g.items.map(([n, p]) => (
                <li key={n} className="flex justify-between gap-4 border-b border-border pb-2 text-sm">
                  <span>{n}</span>
                  <span className="text-muted-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
