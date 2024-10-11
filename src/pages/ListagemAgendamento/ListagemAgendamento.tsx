import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { fetchAgendamentosList } from "@/services/getServices";
import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { splitIntoGroups } from "@/utils/const.utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleDeleteAgendamento } from "@/services/deleteServices";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { IAgendamentoGet } from "@/interfaces/agendamento";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";

const ListagemAgendamento = () => {
  const { idClinica } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const { data, error, isPending } = useQuery({
    queryKey: ["AgendamentosListInternal"],
    queryFn: () => fetchAgendamentosList(idClinica, user.token),
  });

  const mutation = useMutation({
    mutationFn: (id?: string) =>
      handleDeleteAgendamento(idClinica, id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AgendamentosListInternal"] });
    },
  });

  if (isPending) return <div>carregando</div>;
  if (error) return <div>Error fetching clinics</div>;

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
        page="Meus Agendamentos"
        title="Seus Agendamentos"
        size={isPending ? 0 : data.length}
        buttonName="Novo Agendamento"
        clickFn={() => navigate("../agendamento")}
      />

      <div
        className={`flex flex-wrap gap-2 ${user.isDarkMode && "text-white"} `}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data da consulta</TableHead>
              <TableHead>Nome do paciente</TableHead>
              <TableHead>Serviço prestado</TableHead>
              <TableHead>Valor do serviço</TableHead>
              <TableHead>Status</TableHead>
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
                  (paciente: IAgendamentoGet, index: number) => (
                    <TableRow
                      key={paciente.id}
                      className={index % 2 === 0 && "bg-background"}
                    >
                      <TableCell className="font-medium">
                        {dayjs(paciente.date).format("DD/MM/YYYY - HH:mm")}
                      </TableCell>
                      <TableCell>{paciente.patient.name}</TableCell>
                      <TableCell>{paciente.service.title}</TableCell>
                      <TableCell>
                        {parseFloat(paciente.service.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {!dayjs().isBefore(paciente.date) === false
                          ? "A ser realizado"
                          : "Concluido"}
                      </TableCell>

                      <TableCell className="flex justify-end gap-2 ">
                        <Button
                          onClick={() =>
                            navigate(`../editarAgendamento/${paciente.id}`)
                          }
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          onClick={() => mutation.mutate(paciente.id)}
                          variant={"destructive"}
                        >
                          <DeleteIcon />
                        </Button>
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
              className={`${user.isDarkMode && "text-white"}`}
              isActive
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
                    className={`${user.isDarkMode && "text-white"}`}
                    key={index}
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

export default ListagemAgendamento;
