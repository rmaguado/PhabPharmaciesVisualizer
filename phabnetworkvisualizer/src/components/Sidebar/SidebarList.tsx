import ListItem from "./ListItem";
import CategorySublist from "./CategorySublist";

interface ItemListProps {
  categories: { [key: string]: string[] };
  handleCheckboxChange: (name: string, isCategory: boolean) => void;
  handleRadioChange: (name: string) => void;
  checkedCategories: { [key: string]: boolean };
  checkedItems: { [key: string]: boolean };
  isStaging: boolean;
  grouped: boolean;
  selectedStageItem: string | null;
}

function SidebarList({
  categories,
  handleCheckboxChange,
  handleRadioChange,
  checkedCategories,
  checkedItems,
  isStaging,
  grouped,
  selectedStageItem,
}: ItemListProps) {
  return (
    <div className="flex-grow overflow-auto px-8">
      <ul className="list-none">
        {Object.keys(categories).map((category) => {
          if (grouped && !isStaging) {
            return (
              <CategorySublist
                key={category}
                category={category}
                items={categories[category]}
                handleCheckboxChange={handleCheckboxChange}
                checkedCategories={checkedCategories}
                checkedItems={checkedItems}
                isStaging={isStaging}
                handleRadioChange={handleRadioChange}
                selectedStageItem={selectedStageItem}
              />
            );
          } else if (grouped && isStaging) {
            return (
              <ListItem
                key={category}
                item={category}
                handleCheckboxChange={handleCheckboxChange}
                handleRadioChange={handleRadioChange}
                checked={checkedCategories[category]}
                isCategory={true}
                isStaging={isStaging}
                selectedStageItem={selectedStageItem}
              />
            );
          } else {
            // Render individual items as either checkboxes or radio buttons
            return categories[category].map((item) => (
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
            ));
          }
        })}
      </ul>
    </div>
  );
}

export default SidebarList;
