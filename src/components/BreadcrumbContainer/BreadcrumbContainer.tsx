import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { useUserSelector } from "@/store/hooks";

interface IBreadcrumb {
  bcItems: IBreadcrumbItem[];
  page?: any;
  title?: string;
  clickFn?: () => void;
  buttonName?: string;
}

interface IBreadcrumbItem {
  path: string;
  title: string;
}

const BreadcrumbContainer = ({
  bcItems,
  title,
  page,
  clickFn,
  buttonName,
}: IBreadcrumb) => {
  const user = useUserSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-2 mb-2">
      <Breadcrumb>
        <BreadcrumbList>
          {bcItems.map((bc, _index) => (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={bc.path}>{bc.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ))}
          <BreadcrumbPage>{page}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h2
          className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
            user.isDarkMode && "text-white "
          }`}
        >
          {title}
        </h2>

        {buttonName !== undefined && (
          <Button onClick={clickFn}>{buttonName}</Button>
        )}
      </div>
    </div>
  );
};

export default BreadcrumbContainer;
