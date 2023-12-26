import ListItem from "./ListItem";

interface CategoryItemProps {
  category: string;
  items: string[];
  handleCheckboxChange: (name: string, isCategory: boolean) => void;
  checkedCategories: { [key: string]: boolean };
  checkedItems: { [key: string]: boolean };
  isStaging: boolean;
  handleRadioChange: (name: string) => void;
  selectedStageItem: string | null;
}

function CategorySublist({
  category,
  items,
  handleCheckboxChange,
  checkedCategories,
  checkedItems,
  isStaging,
  handleRadioChange,
  selectedStageItem,
}: CategoryItemProps) {
  return (
    <li key={category} className="mt-2">
      <label className="block text-lg font-semibold">
        <input
          type="checkbox"
          checked={checkedCategories[category]}
          onChange={() => handleCheckboxChange(category, true)}
          className="mr-2"
        />
        {category}
      </label>
      <ul className="list-none ml-4">
        {items.map((item) => (
          <ListItem
            key={item}
            item={item}
            handleCheckboxChange={handleCheckboxChange}
            handleRadioChange={handleRadioChange}
            checked={checkedItems[item]}
            isCategory={false}
            isStaging={isStaging}
            selectedStageItem={selectedStageItem}
          />
        ))}
      </ul>
    </li>
  );
}

export default CategorySublist;
