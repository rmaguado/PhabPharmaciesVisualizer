import ActionButton from "./ActionButton";

interface SidebarFooterProps {
  toggleSelectAll: () => void;
  handleGroupClick: () => void;
  handleSetStageClick: () => void;
  selectAll: boolean;
  groupedMode: boolean;
  isStaging: boolean;
  stagedItem: string | null;
}

function SidebarFooter({
  toggleSelectAll,
  handleGroupClick,
  handleSetStageClick,
  selectAll,
  groupedMode,
  isStaging,
  stagedItem,
}: SidebarFooterProps) {
  return (
    <div className="flex flex-col px-2 py-2 border-gray-300 bg-gray-100 justify-between">
      <div className="flex flex-row px-4 py-2 justify-between">
        <ActionButton
          onClick={handleSetStageClick}
          additionalClasses={`flex-1 text-white ${
            stagedItem !== null
              ? "bg-gray-500 focus:ring-gray-500"
              : "bg-blue-600 focus:ring-blue-500"
          }`}
        >
          {isStaging
            ? "Confirm"
            : stagedItem === null
            ? "Set staged item"
            : "Unstage item"}
        </ActionButton>
      </div>
      <div className="flex flex-row py-2 px-2 justify-between">
        <ActionButton
          onClick={toggleSelectAll}
          additionalClasses={`flex-1 mx-2 text-white ${
            selectAll
              ? "bg-gray-500 focus:ring-gray-500"
              : "bg-blue-600 focus:ring-blue-500"
          }`}
        >
          {selectAll ? "Deselect All" : "Select All"}
        </ActionButton>
        <ActionButton
          onClick={handleGroupClick}
          additionalClasses={`flex-1 mx-2 text-white ${
            groupedMode
              ? "bg-gray-500 focus:ring-gray-500"
              : "bg-blue-600 focus:ring-blue-500"
          }`}
        >
          {groupedMode ? "Ungroup items" : "Group items"}
        </ActionButton>
      </div>
    </div>
  );
}

export default SidebarFooter;
