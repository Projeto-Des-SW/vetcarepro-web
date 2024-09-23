import Header from "@/components/Header/Header";
import { useUserSelector } from "@/store/hooks";
import { Outlet } from "react-router-dom";

const Root = () => {
  const user = useUserSelector((state) => state.user);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div>
        <Header />
      </div>

      <main
        className={`flex-grow min-h-0 ${
          user.isDarkMode && "bg-black"
        } `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
