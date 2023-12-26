interface SingleItemProps {
  item: string;
  handleCheckboxChange: (name: string, isCategory: boolean) => void;
  checked: boolean;
  isCategory: boolean;
  isStaging: boolean;
  handleRadioChange: (name: string) => void;
  selectedStageItem: string | null;
}

function ListItem({
  item,
  handleCheckboxChange,
  checked,
  isCategory,
  isStaging,
  handleRadioChange,
  selectedStageItem,
}: SingleItemProps) {
  const inputType = isStaging ? "radio" : "checkbox";
  const onChange = isStaging
    ? () => handleRadioChange(item)
    : () => handleCheckboxChange(item, isCategory);

  return (
    <li key={item + "_listitem"} className="mt-2">
      <label className="block text-sm">
        <input
          type={inputType}
          name={isStaging ? "selectedStagedItem" : ""}
          checked={isStaging ? selectedStageItem === item : checked || false}
          onChange={onChange}
          className="mr-2"
        />
        {item}
      </label>
    </li>
  );
}

export default ListItem;
