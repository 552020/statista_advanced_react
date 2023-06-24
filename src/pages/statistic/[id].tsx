import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { QueryData, Item } from "../index";

export const StatisticItem: React.FC<{ item: Item }> = ({ item }) => {
  const imageOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = item.teaser_image_urls.reduce((prev, curr) => (prev.width > curr.width ? prev : curr)).src;
  };

  return (
    <div className="border-2 border-gray-200 my-4 p-4 rounded">
      <Link href={item.link} className="text-2xl mb-4 text-blue-500 hover:underline">
        {item.title}
      </Link>
      {item.premium === 1 && <span className="inline-block bg-red-500 text-white px-2 py-1 ml-2 rounded">Premium</span>}
      <p>{item.subject}</p>
      <p>{item.description}</p>
      <p>{new Date(item.date).toLocaleDateString()}</p>
      <img src={item.image_url} alt={item.title} onError={imageOnError} />
    </div>
  );
};

export default function Statistic() {
  const router = useRouter();
  const { id, searchTerm, isRealApi, page } = router.query;
  const queryClient = useQueryClient();

  const allData = queryClient.getQueryData<QueryData>(["statistics", searchTerm, isRealApi === "true", Number(page)]);

  //   console.log("allData", allData);

  let item;
  if (Array.isArray(allData)) {
    item = (allData as Item[]).find((item: Item) => item.identifier === Number(id));
  }

  //   console.log("item", item);

  if (!item) {
    return <p>No data found</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <StatisticItem item={item} />
      <Link href="/" className="text-blue-500 hover:underline">
        Back to list
      </Link>
    </div>
  );
}
