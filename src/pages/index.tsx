import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchData(searchTerm: string, isRealApi: boolean, page: number) {
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
      const resultsPerPage = 10;
      const start = page * resultsPerPage;
      const end = start + resultsPerPage;
      data = searchTerm.toLowerCase() === "statista" ? data.items.slice(start, end) : [];
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
  const [page, setPage] = useState(0);
  const { isLoading, isError, data, error, isFetching, isPreviousData } = useQuery(
    ["statistics", searchTerm, isRealApi, page],
    () => fetchData(searchTerm, isRealApi, page),
    { enabled: isSubmit, keepPreviousData: true }
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
        <div className="mt-4">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="mr-2 p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Previous Page
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isPreviousData) {
                setPage(page + 1);
              }
            }}
            disabled={isPreviousData || isFetching}
            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Next Page
          </button>
          {isFetching ? <span>Loading...</span> : null}
        </div>
      </form>
    </div>
  );
}
