import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchData(searchTerm: string, isRealApi: boolean) {
  try {
    let res;
    if (isRealApi) {
      res = await fetch(`https://www.statista.com/api/v2/statistics?q=${searchTerm}`, {
        headers: {
          "X-STATISTA-API-KEY": process.env.REACT_APP_STATISTA_API_KEY || "",
        },
      });
      if (res.status === 401) {
        throw new Error("Invalid API Key");
      }
    } else {
      res = await fetch("https://cdn.statcdn.com/static/application/search_results.json");
    }

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await res.json();
    if (!isRealApi) {
      data = searchTerm.toLowerCase() === "statista" ? data.items : [];
    } else {
      data = data.items || [];
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRealApi, setIsRealApi] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { isLoading, isError, data, error } = useQuery(
    ["statistics", searchTerm, isRealApi],
    () => fetchData(searchTerm, isRealApi),
    { enabled: isSubmit }
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmit(true);
  };

  return (
    <div className="h-screen bg-white">
      <button
        type="button"
        onClick={() => setIsRealApi(!isRealApi)}
        className="absolute right-4 top-4 p-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        {isRealApi ? "Switch to Local API" : "Switch to Real API"}
      </button>

      <form onSubmit={onSubmit} className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
          Submit
        </button>

        {isLoading && <div>Loading...</div>}
        {isError && (
          <div>
            <span>isError-</span> <span>Error: {(error as Error).message}</span>
          </div>
        )}
        {data &&
          data.map((result: any, index: number) => (
            <div key={index} className="p-2 border rounded">
              {result.title}
            </div>
          ))}
      </form>
    </div>
  );
}
