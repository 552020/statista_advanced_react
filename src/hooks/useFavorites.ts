import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Item } from "@/pages/index";

const localStorageKey = "favorites";

function getFavorites(): Promise<Item[]> {
  return new Promise((resolve) => {
    const favorites = localStorage.getItem(localStorageKey);
    resolve(favorites ? JSON.parse(favorites) : []);
  });
}

function saveFavorite(newFavorite: Item): Promise<void> {
  return new Promise((resolve) => {
    getFavorites().then((favorites) => {
      localStorage.setItem(localStorageKey, JSON.stringify([...favorites, newFavorite]));
      resolve();
    });
  });
}

function removeFavorite(id: number): Promise<void> {
  return new Promise((resolve) => {
    getFavorites().then((favorites) => {
      const newFavorites = favorites.filter((favorite: Item) => favorite.identifier !== id);
      localStorage.setItem(localStorageKey, JSON.stringify(newFavorites));
      resolve();
    });
  });
}

export function useFavorites() {
  const queryClient = new QueryClient();

  const { data: favorites } = useQuery<Item[]>([localStorageKey], getFavorites);

  const addFavoriteMutation = useMutation<void, Error, Item>((newFavorite: Item) => saveFavorite(newFavorite), {
    onSuccess: () => {
      queryClient.invalidateQueries([localStorageKey]);
    },
  });

  const removeFavoriteMutation = useMutation<void, Error, number>((id: number) => removeFavorite(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([localStorageKey]);
    },
  });

  return { favorites, addFavorite: addFavoriteMutation.mutate, removeFavorite: removeFavoriteMutation.mutate };
}
