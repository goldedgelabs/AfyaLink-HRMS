
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
