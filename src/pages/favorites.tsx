// pages/favorites.tsx

import Link from "next/link";
import { useFavorites } from "../hooks/useFavorites";
import { StatisticItem } from "@/pages/statistic/[id]";
import { Item } from "../pages/index";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl mb-4">Favorite Statistics</h1>
      {/* {favorites.map((item: Item) => (
        <StatisticItem key={item.identifier} item={item} />
      ))} */}
      {favorites && favorites.map((item: Item) => <StatisticItem key={item.identifier} item={item} />)}
      <Link href="/" className="text-blue-500 hover:underline">
        Back to list
      </Link>
    </div>
  );
}
