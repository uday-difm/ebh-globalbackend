// Import necessary components
// import Sidebar from "./Sidebar";
// import TopBar from "./TopBar";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
// import TopBar from "./TopBar";



// Define types for the props
interface DashboardLayoutProps {
  children: React.ReactNode;  // The 'children' prop can be any valid React node (e.g., elements, strings, numbers)
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <Sidebar></Sidebar>
      <div className="ml-64 w-full min-h-screen bg-gray-50">
        {/* Add TopBar here */}
        {/* <TopBar /> */}
        {/* <TopBar></TopBar> */}
        <TopBar></TopBar>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
