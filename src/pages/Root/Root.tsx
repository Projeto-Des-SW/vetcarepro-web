import Header from "@/components/Header/Header";
import { useUserSelector } from "@/store/hooks";
import { Outlet } from "react-router-dom";

const Root = () => {
  const user = useUserSelector((state) => state.user);
  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${
        user.isDarkMode && "dark"
      }`}
    >
      <div>
        <Header />
      </div>

      <main className={`flex-grow min-h-0 dark:bg-slate-950`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
