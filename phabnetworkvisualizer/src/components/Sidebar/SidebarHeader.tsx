function SidebarHeader() {
  return (
    <a
      href="/"
      className="flex items-center justify-left w-full p-4 border-b border-gray-200"
    >
      <img src="/logo.svg" alt="PhabPharmacies Logo" className="h-8 mr-2" />
    </a>
  );
}

export default SidebarHeader;
