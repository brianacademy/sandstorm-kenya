"use client";

import { useRouter } from "next/navigation";

interface Props {
  currentSort: string;
  currentCategory?: string;
  currentQ?: string;
}

export default function ShopSortClient({ currentSort, currentCategory, currentQ }: Props) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (currentQ) params.set("q", currentQ);
    params.set("sort", e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="sort-select">
      <span>Sort by</span>
      <select
        aria-label="Sort products"
        value={currentSort}
        onChange={handleChange}
        id="shop-sort-select"
      >
        <option value="alpha-asc">Alphabetically, A–Z</option>
        <option value="alpha-desc">Alphabetically, Z–A</option>
        <option value="price-asc">Price, Low to High</option>
        <option value="price-desc">Price, High to Low</option>
      </select>
    </div>
  );
}
