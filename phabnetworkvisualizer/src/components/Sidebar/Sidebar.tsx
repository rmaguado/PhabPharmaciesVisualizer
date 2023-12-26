import { useState, useEffect } from "react";

import SidebarHeader from "./SidebarHeader";
import SearchInput from "./SearchInput";
import SidebarFooter from "./SidebarFooter";
import SidebarList from "./SidebarList";

interface SidebarProps {
  categories: { [key: string]: string[] };
  groupedMode: boolean;
  setGroupedMode: React.Dispatch<React.SetStateAction<boolean>>;
  checkedCategories: { [key: string]: boolean };
  setCheckedCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  checkedItems: { [key: string]: boolean };
  setCheckedItems: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  stagedItem: string | null;
  setStagedItem: React.Dispatch<React.SetStateAction<string | null>>;
}

function Sidebar({
  categories,
  groupedMode,
  setGroupedMode,
  checkedCategories,
  setCheckedCategories,
  checkedItems,
  setCheckedItems,
  stagedItem,
  setStagedItem,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectAll, setSelectAll] = useState(true);
  const [isStaging, setIsStaging] = useState(false);
  const [selectedStageItem, setSelectedStageItem] = useState<string | null>(
    null
  );

  useEffect(() => {
    const initialCheckedCategories: { [key: string]: boolean } = {};
    const initialCheckedItems: { [key: string]: boolean } = {};

    Object.keys(categories).forEach((category) => {
      initialCheckedCategories[category] = true;
      categories[category].forEach((item) => {
        initialCheckedItems[item] = true;
      });
    });
    setCheckedCategories(initialCheckedCategories);
    setCheckedItems(initialCheckedItems);
  }, [categories]);

  useEffect(() => {
    setCheckedCategories(checkedCategories);
  }, [checkedCategories, setCheckedCategories]);

  useEffect(() => {
    setCheckedItems(checkedItems);
  }, [checkedItems, setCheckedItems]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const newCheckedState = !selectAll;
    const newCheckedCategories = Object.fromEntries(
      Object.keys(checkedCategories).map((key) => [key, newCheckedState])
    );
    const newCheckedItems = Object.fromEntries(
      Object.keys(checkedItems).map((key) => [key, newCheckedState])
    );

    setCheckedCategories(newCheckedCategories);
    setCheckedItems(newCheckedItems);
  };

  const handleCheckboxChange = (name: string, isCategory: boolean) => {
    const newCheckedState = !checkedCategories[name];
    if (isCategory) {
      setCheckedCategories((prevState) => ({
        ...prevState,
        [name]: newCheckedState,
      }));
      const newCheckedItems = { ...checkedItems };
      if (!newCheckedState) {
        categories[name].forEach((item) => {
          newCheckedItems[item] = false;
        });
      } else {
        categories[name].forEach((item) => {
          newCheckedItems[item] = true;
        });
      }
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems((prevState) => ({
        ...prevState,
        [name]: !prevState[name],
      }));
    }
  };

  const handleGroupClick = () => {
    setGroupedMode(!groupedMode);
    if (groupedMode) {
      setStagedItem(null);
    }
  };

  const handleSetStageClick = () => {
    if (isStaging) {
      setStagedItem(selectedStageItem);
      setSelectedStageItem(null);
      setIsStaging(!isStaging);
    } else {
      if (stagedItem === null) {
        setIsStaging(!isStaging);
      } else {
        setStagedItem(null);
      }
    }
  };

  const handleRadioChange = (item: string) => {
    setSelectedStageItem(item);
  };

  interface FilteredCategories {
    [key: string]: string[];
  }

  const filteredCategories = Object.keys(categories).reduce(
    (acc: FilteredCategories, category) => {
      acc[category] = categories[category].filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return acc;
    },
    {}
  );

  return (
    <div className="fixed top-0 left-0 z-40 w-96 p-0 h-full flex flex-col bg-gray-100 shadow-lg">
      <div className="border-b">
        <SidebarHeader />
      </div>
      <div className="px-4">
        <SearchInput setSearchQuery={setSearchQuery} />
      </div>
      <SidebarList
        categories={filteredCategories}
        handleCheckboxChange={handleCheckboxChange}
        handleRadioChange={handleRadioChange}
        checkedCategories={checkedCategories}
        checkedItems={checkedItems}
        isStaging={isStaging}
        grouped={groupedMode}
        selectedStageItem={selectedStageItem}
      />
      <SidebarFooter
        toggleSelectAll={toggleSelectAll}
        handleGroupClick={handleGroupClick}
        handleSetStageClick={handleSetStageClick}
        selectAll={selectAll}
        groupedMode={groupedMode}
        isStaging={isStaging}
        stagedItem={stagedItem}
      />
    </div>
  );
}

export default Sidebar;
