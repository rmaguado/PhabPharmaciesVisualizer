interface SearchInputProps {
  setSearchQuery: (query: string) => void;
}

function SearchInput({ setSearchQuery }: SearchInputProps) {
  return (
    <div className="px-2 py-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
