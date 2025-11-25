import clsx from "clsx";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

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
    <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-neutral-300 transition-colors">
        <Search size={16} />
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter videos..."
        className={clsx(
          "w-full pl-10 pr-10 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl",
          "text-sm text-neutral-200 placeholder:text-neutral-600",
          "focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700",
          "transition-all duration-200"
        )}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
