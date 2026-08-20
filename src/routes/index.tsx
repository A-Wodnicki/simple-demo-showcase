import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kawiarnia Nocna — Palarnia kawy w Warszawie" },
      {
        name: "description",
        content:
          "Kawiarnia Nocna to mała palarnia specialty w Warszawie. Świeżo palona kawa, sezonowe menu i spokojne miejsce do pracy.",
      },
      { property: "og:title", content: "Kawiarnia Nocna — Palarnia kawy" },
      {
        property: "og:description",
        content: "Świeżo palona kawa specialty i spokojne miejsce w centrum Warszawy.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Palarnia specialty · Warszawa
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Kawa palona nocą, podawana rano.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Małe partie, jasne palenie i menu, które zmienia się razem z sezonem zbiorów.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/menu"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Zobacz menu
          </Link>
          <Link
            to="/kontakt"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Odwiedź nas
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { t: "Świeżość", d: "Palimy dwa razy w tygodniu, sprzedajemy do 21 dni od wypału." },
          { t: "Pochodzenie", d: "Kupujemy bezpośrednio od farm w Etiopii, Kolumbii i Peru." },
          { t: "Spokój", d: "Bez muzyki po 18:00. Dużo gniazdek, wolne stoliki i cisza." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-medium">{c.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
