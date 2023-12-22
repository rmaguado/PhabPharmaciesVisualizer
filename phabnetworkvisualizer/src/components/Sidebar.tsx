import { useState, useEffect } from "react";

interface SidebarProps {
  categories: { [key: string]: string[] };
  updateGroupedMode: React.Dispatch<React.SetStateAction<boolean>>;
  updateCheckedCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  updateCheckedItems: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

function Sidebar({
  categories,
  updateGroupedMode,
  updateCheckedCategories,
  updateCheckedItems,
}: SidebarProps) {
  const [grouped, setGrouped] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedCategories, setCheckedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState(true);
  const [stagedItem, setStagedItem] = useState<string | null>(null);
  const [isStaging, setIsStaging] = useState(false);

  // Only run this effect on initial mount and when categories change
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
    updateCheckedCategories(checkedCategories);
  }, [checkedCategories, updateCheckedCategories]);

  useEffect(() => {
    updateCheckedItems(checkedItems);
  }, [checkedItems, updateCheckedItems]);

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
      // If a category is unchecked, uncheck all items in the category
      if (!newCheckedState) {
        const newCheckedItems = { ...checkedItems };
        categories[name].forEach((item) => {
          newCheckedItems[item] = false;
        });
        setCheckedItems(newCheckedItems);
      }
    } else {
      setCheckedItems((prevState) => ({
        ...prevState,
        [name]: !prevState[name],
      }));
    }
  };

  const handleStageClick = (item: string) => {
    if (stagedItem === item) {
      // Unstage the item if it's already staged
      setStagedItem(null);
    } else {
      // Stage the item
      setStagedItem(item);
    }
  };

  const handleGroupClick = () => {
    updateGroupedMode(!grouped);
    setGrouped(!grouped);
    // Clear staged item when toggling group mode
    if (grouped) {
      setStagedItem(null);
    }
  };

  const handleSetStageClick = () => {
    setIsStaging(!isStaging);
    if (isStaging && stagedItem) {
      // Confirm the staged item
      // Perform an action with the stagedItem
      console.log("Confirmed item:", stagedItem);
      setIsStaging(false); // Exit staging mode
      setStagedItem(null); // Reset staged item
    }
  };

  const renderGroupedCategories = () => {
    return Object.keys(categories).map((category) => {
      // Check if the category has any items after filtering
      if (filteredCategories[category].length > 0) {
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
          </li>
        );
      }
      // Return null if the category has no items after filtering
      return null;
    });
  };

  const renderGroupedItems = () => {
    return Object.keys(filteredCategories).map((category) => {
      // Only render items if the category is checked
      if (checkedCategories[category]) {
        return (
          <ul key={category} className="ml-4">
            {filteredCategories[category].map((item) => (
              <li key={item} className="mt-1">
                <label className="block text-sm">
                  <input
                    type="checkbox"
                    checked={checkedItems[item]}
                    onChange={() => handleCheckboxChange(item, false)}
                    className="mr-2"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  const renderItemsOrCategories = () => {
    if (stagedItem) {
      // Render only categories if an item is staged
      return renderGroupedCategories();
    } else if (grouped) {
      // Render categories with items if not in staging mode
      return renderGroupedCategories().concat(renderGroupedItems());
    } else {
      // Render all items flatly if not grouped
      return Object.values(filteredCategories)
        .flat()
        .map((item) => (
          <li key={item} className="mt-2">
            <label className="block text-sm">
              <input
                type="checkbox"
                checked={checkedItems[item]}
                onChange={() => handleCheckboxChange(item, false)}
                className="mr-2"
              />
              {item}
            </label>
          </li>
        ));
    }
  };

  const handleRadioChange = (item: string) => {
    setStagedItem(item);
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
    <div className="fixed top-0 left-0 z-40 w-80 h-screen bg-gray-100 shadow-lg sm:w-96">
      <div className="flex flex-col h-full">
        <a
          href="/"
          className="flex items-center justify-left w-full p-4 border-b border-gray-200"
        >
          <img src="/logo.svg" alt="PhabPharmacies Logo" className="h-8 mr-2" />
        </a>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ul className="flex-grow p-4 overflow-auto">
          {/* Conditional rendering based on whether an item is staged or if grouped mode is active */}
          {stagedItem && grouped
            ? Object.keys(filteredCategories).map(
                (category) =>
                  // Render category only if it has items after filtering
                  filteredCategories[category].length > 0 && (
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
                    </li>
                  )
              )
            : grouped
            ? Object.keys(filteredCategories).map(
                (category) =>
                  // Return null if the category has no items after filtering
                  filteredCategories[category].length > 0 && (
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
                      <ul className="ml-4">
                        {filteredCategories[category].map((item) => (
                          <li key={item} className="mt-1">
                            <label className="block text-sm">
                              <input
                                type="checkbox"
                                checked={checkedItems[item]}
                                onChange={() =>
                                  handleCheckboxChange(item, false)
                                }
                                className="mr-2"
                              />
                              {item}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
              )
            : Object.values(filteredCategories)
                .flat()
                .map((item) => (
                  <li key={item} className="mt-2">
                    <label className="block text-sm">
                      <input
                        type="checkbox"
                        checked={checkedItems[item]}
                        onChange={() => handleCheckboxChange(item, false)}
                        className="mr-2"
                      />
                      {item}
                    </label>
                  </li>
                ))}
        </ul>

        <div className="flex flex-col px-4 py-2 border-t border-gray-300 bg-gray-100 justify-between">
          <button
            onClick={toggleSelectAll}
            className={`py-2 px-4 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full ${
              selectAll
                ? "bg-gray-500 focus:ring-gray-500"
                : "bg-blue-600 focus:ring-blue-500"
            }`}
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="flex px-4 py-4 mt-4 space-x-2 bg-gray-100 border-t border-gray-300">
          <button
            onClick={handleGroupClick}
            className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Group items
          </button>
          <button
            onClick={handleSetStageClick}
            className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isStaging ? "Confirm" : "Set staged item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
