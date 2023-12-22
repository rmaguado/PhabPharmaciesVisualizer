import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";

interface itemResponseData {
  inventory: { [key: string]: string[] };
}

function App() {
  const [itemCategories, setItemCategories] = useState<{
    [key: string]: string[];
  }>({});
  const [groupedMode, setGroupedMode] = useState(false);
  const [checkedCategories, setCheckedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchItemNames = async () => {
      const response = await axios.get("http://127.0.0.1:8000/item_names/");
      const responseData: itemResponseData = response.data;
      try {
        setItemCategories(responseData.inventory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemNames();
  }, []);

  return (
    <div>
      <Sidebar
        categories={itemCategories}
        updateGroupedMode={setGroupedMode}
        updateCheckedCategories={setCheckedCategories}
        updateCheckedItems={setCheckedItems}
      />
    </div>
  );
}

export default App;
