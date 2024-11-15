import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    "https://672dc313fd897971564393d7.mockapi.io/Product"
  );

  if (!response.ok) {
    throw new Error("cannot fetch blog");
  }

  return response.json();
}

interface Product {
  id: number;
  name: string;
}

export default async function Home() {
  const product = await getProducts();
  console.log("Product", product);
  return (
    <ul>
      {product.map((product, index) => (
        <li key={index} className="my-2">
          {product.id} {product.name}{" "}
          <Link href={`product/${product.id}`}>
            <button className="px-4 py-2 bg-blue-400">Read more</button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
