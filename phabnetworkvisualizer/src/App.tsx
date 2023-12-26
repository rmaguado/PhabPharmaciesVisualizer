import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

import Sidebar from "./components/Sidebar/Sidebar";
import TimeFilter from "./components/TimeFilter/TimeFilter";

interface dateRangeData {
  startDate: string;
  endDate: string;
}

interface itemHistoryFormTemplate {
  item_name: string;
  checked_items: string[];
  start_date: string;
  end_date: string;
}

interface networkDataFormTemplate {
  staged_item_name: string;
  grouped_mode: boolean;
  checked_items: string[];
  checked_categories: string[];
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
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
  const [stagedItem, setStagedItem] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<dateRangeData>({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchItemNames = async () => {
      const response = await axios.get("http://127.0.0.1:8000/item_names/");
      const responseData = response.data;
      try {
        setItemCategories(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemNames();
  }, []);

  const [itemHistory, setItemHistory] = useState<{ [key: string]: number }>({});
  const [itemHistoryForm, setItemHistoryForm] =
    useState<itemHistoryFormTemplate>({
      item_name: "",
      checked_items: [],
      start_date: "",
      end_date: "",
    });
  const [networkDataForm, setNetworkDataForm] =
    useState<networkDataFormTemplate>({
      staged_item_name: "",
      grouped_mode: false,
      checked_items: [],
      checked_categories: [],
      start_date: "",
      end_date: "",
      start_time: "0:00",
      end_time: "23:59",
    });
  const [timeRange, setTimeRange] = useState({
    start: 0,
    end: 23,
  });

  useEffect(() => {
    const fetchItemHistory = async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/purchase_history/",
        {
          params: itemHistoryForm,
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        }
      );
      const responseData = response.data;
      try {
        setItemHistory(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItemHistory();
  }, [itemHistoryForm]);

  useEffect(() => {
    console.log("new date range:", dateRange);
    setItemHistoryForm({
      item_name: groupedMode ? "" : stagedItem ? stagedItem : "",
      checked_items:
        groupedMode && stagedItem
          ? Object.keys(checkedItems).filter(
              (item) =>
                checkedItems[item] && itemCategories[stagedItem].includes(item)
            )
          : Object.keys(checkedItems).filter((item) => checkedItems[item]),
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    });
  }, [stagedItem, checkedItems, dateRange]);

  useEffect(() => {
    setNetworkDataForm({
      staged_item_name: stagedItem ? stagedItem : "",
      grouped_mode: groupedMode,
      checked_items: Object.keys(checkedItems).filter(
        (item) => checkedItems[item]
      ),
      checked_categories: Object.keys(checkedCategories).filter(
        (cat) => checkedCategories[cat]
      ),
      start_date: "",
      end_date: "",
      start_time: timeRange.start + ":00" || "",
      end_time: timeRange.end + ":59" || "",
    });
  }, []);

  return (
    <div className="fixed flex flex-row h-screen w-screen">
      <div className="flex-shrink-0 w-96 h-full">
        <Sidebar
          categories={itemCategories}
          groupedMode={groupedMode}
          setGroupedMode={setGroupedMode}
          checkedCategories={checkedCategories}
          setCheckedCategories={setCheckedCategories}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          stagedItem={stagedItem}
          setStagedItem={setStagedItem}
        />
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow w-full h-3/5 bg-gray-800"></div>
        <div className="flex-grow w-full h-2/5">
          <TimeFilter
            dataPoints={itemHistory}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            dateRange={dateRange}
            setDateRange={setDateRange}
            staged_item_name={stagedItem}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
