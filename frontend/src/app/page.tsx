import { type Product, PromoCodeTypes } from "@/entities/product";
import Filter from "./(mainPage)/(ui)/filter/Filter";
import ProductList from "./(mainPage)/(ui)/product-list/ProductList";
import styles from "./(mainPage)/page.module.scss";

const products: Product[] = [
  ...Array.from({ length: 30 }).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    brand: {
      name: ["Nike", "Adidas", "Puma", "Apple", "Samsung", "Sony"][i % 6],
      id: `brand-${i + 1}`,
    },
    price: 50 + i * 7,
    rate: Number((3.5 + (i % 15) * 0.1).toFixed(1)),
    promoCodes:
      i % 3 === 0
        ? [
            {
              type: PromoCodeTypes.percentage,
              value: 10 + (i % 4) * 5,
              minOrder: 100,
            },
          ]
        : i % 5 === 0
          ? [
              {
                type: PromoCodeTypes.free_shipping,
                value: 0,
                minOrder: 80,
              },
            ]
          : [],
    imgUrls: [
      `https://picsum.photos/seed/product-${i + 1}-1/600/600`,
      `https://picsum.photos/seed/product-${i + 1}-2/600/600`,
    ],
  })),
];
export default function Home() {
  return (
    <div className={styles.page}>
      <aside className={styles.filter}>
        <Filter />
      </aside>
      <main className={styles.main}>
        <ProductList products={products} />
      </main>
    </div>
  );
}
