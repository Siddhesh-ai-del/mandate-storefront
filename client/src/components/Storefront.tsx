import { useEffect, useState } from "react";

interface Product {
  sku: string;
  name: string;
  priceCents: number;
  category: string;
  rating: number;
  stock: number;
  blurb: string;
}

interface StorefrontData {
  shop: { id: string; name: string; currency: string };
  items: Product[];
}

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function Storefront() {
  const [data, setData] = useState<StorefrontData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/storefront")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e.message ?? e)));
  }, []);

  if (error) return <div className="placeholder">Storefront unavailable: {error}</div>;
  if (!data) return <div className="placeholder">Loading catalog…</div>;

  return (
    <div className="catalog">
      <div className="catalog-meta">
        <span>{data.shop.name}</span>
        <span className="mono muted">{data.items.length} SKUs · agent-readable</span>
      </div>
      {data.items.map((p) => (
        <div className="row" key={p.sku}>
          <div className="row-main">
            <span className="row-name">{p.name}</span>
            <span className="mono muted row-sku">
              {p.sku} · ★{p.rating} · {p.stock} in stock
            </span>
          </div>
          <span className="row-cat">{p.category}</span>
          <span className="mono row-price">{money(p.priceCents)}</span>
        </div>
      ))}
    </div>
  );
}
