import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div>
        <Header />
      </div>

      <main className="flex-grow min-h-0 ">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
