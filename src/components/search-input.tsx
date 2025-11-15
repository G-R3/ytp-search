import clsx from "clsx";
import { useEffect, useState } from "react";

type SearchProps = {
  onSearch: (search: string) => void;
};

export const SearchInput = ({ onSearch }: SearchProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search playlist..."
      className={clsx(
        "px-3 py-1 text-sm h-10 text-neutral-300 bg-neutral-900 rounded-lg focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
      )}
    />
  );
};
