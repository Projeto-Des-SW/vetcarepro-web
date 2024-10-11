import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { IService } from "@/interfaces/servico";
import { useState } from "react";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { fetchServiceList } from "@/services/getServices";
import { splitIntoGroups } from "@/utils/const.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { handleDeleteService } from "@/services/deleteServices";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";

const ListagemServico = () => {
  const navigate = useNavigate();
  const { idClinica } = useParams();
  const user = useUserSelector((state) => state.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const { data, error, isPending } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: () => fetchServiceList(idClinica, user.token),
  });

  const mutation = useMutation({
    mutationFn: (id?: string) => handleDeleteService(idClinica, id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ServicoList"] });
      dispatch(
        addNotification({
          title: "Serviço deletado",
          description: `Serviço deletado`,
        })
      );
    },
  });

  if (error) return <div>Error fetching clinics</div>;
  if (isPending) return <div>Carregando</div>;

  const totalPages = splitIntoGroups(data, itemsPerPage);

  return (
    <section className="flex-wrap gap-2 flex-col w-full">
      <BreadcrumbContainer
        bcItems={[
          { path: "/home", title: "Home" },
          { path: "/dashboard/listagemClinica", title: "Dashboard" },
          {
            path: `/internalClinica/${idClinica}/dashboard`,
            title: "Minha Clinica",
          },
        ]}
        page="Meus Serviços"
        title="Seus Serviços"
        size={isPending ? 0 : data.length}
        buttonName={user.role === "SECRETARY" ? undefined : "Novo Serviço"}
        clickFn={() => navigate("../cadastrarServico")}
      />

      <div
        className={`flex flex-wrap gap-2 ${user.isDarkMode && "text-white"} `}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Titulo</TableHead>
              <TableHead>Tipo do serviço</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : totalPages[currentPage]?.map(
                  (service: IService, index: number) => (
                    <TableRow
                      key={service.id}
                      className={index % 2 === 0 && "bg-background"}
                    >
                      {" "}
                      <TableCell className="font-medium">
                        {service.title}
                      </TableCell>
                      <TableCell>{service.type}</TableCell>
                      <TableCell>
                        {parseFloat(service.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2 ">
                        <Button
                          onClick={() =>
                            navigate(`../detailsServico/${service.id}`)
                          }
                        >
                          <InfoIcon />
                        </Button>
                        {user.role !== "SECRETARY" && (
                          <Button
                            onClick={() => mutation.mutate(service.id)}
                            variant={"destructive"}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
          </TableBody>
        </Table>
        <Separator />
      </div>
      <div className="fixed bottom-8 left-1/2 transform ml-4 -translate-x-1/2 mt-4">
        <Pagination>
          <PaginationPrevious
            className={`${user.isDarkMode && "text-white"}`}
            onClick={() =>
              currentPage !== 0 && setCurrentPage((prevState) => prevState - 1)
            }
          />
          {totalPages.length === 1 && (
            <PaginationLink
              isActive
              className={`${user.isDarkMode && "text-white"}`}
            >
              {1}
            </PaginationLink>
          )}
          {totalPages.length > 1 &&
            totalPages.map((_, index) => {
              if (
                index === 0 ||
                index === totalPages.length - 1 ||
                index === currentPage ||
                index === currentPage - 1 ||
                index === currentPage + 1
              ) {
                return (
                  <PaginationLink
                    className={`${user.isDarkMode && "text-white"}`}
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    isActive={currentPage === index}
                  >
                    {index + 1}
                  </PaginationLink>
                );
              }
              if (
                (index === 1 && currentPage > 3) ||
                (index === totalPages.length - 2 &&
                  currentPage < totalPages.length - 4)
              ) {
                return (
                  <PaginationEllipsis
                    key={index}
                    className={`${user.isDarkMode && "text-white"}`}
                  >
                    ...
                  </PaginationEllipsis>
                );
              }

              return null;
            })}

          <PaginationNext
            className={`${user.isDarkMode && "text-white"}`}
            onClick={() =>
              currentPage !== totalPages.length - 1 &&
              setCurrentPage((prevState) => prevState + 1)
            }
          />
        </Pagination>
      </div>
    </section>
  );
};

export default ListagemServico;
