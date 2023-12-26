interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  additionalClasses: string;
}

function ActionButton({
  onClick,
  children,
  additionalClasses,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full ${additionalClasses}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
