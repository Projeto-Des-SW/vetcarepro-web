import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { fetchAgendamentosList } from "@/services/GetServices";
import {
  Pagination,
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
import { handleDeleteAgendamento } from "@/services/DeleteServices";
import { Separator } from "@/components/ui/separator";
import * as dayjs from "dayjs";
import { IAgendamentoGet } from "@/interfaces/agendamento";

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

  console.log(data);

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
      <h2
        className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
          user.isDarkMode && "text-white"
        }`}
      >
        Seus agendamentos
      </h2>
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
              : totalPages[currentPage]?.map((paciente: IAgendamentoGet) => (
                  <TableRow key={paciente.id}>
                    <TableCell className="font-medium">
                      {dayjs(paciente.date).format("DD/MM/YYYY - HH:mm")}
                    </TableCell>
                    <TableCell>{paciente.patient.name}</TableCell>
                    <TableCell>{paciente.service.title}</TableCell>
                    <TableCell>{paciente.service.amount}</TableCell>
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
                        Editar
                      </Button>
                      <Button
                        onClick={() => mutation.mutate(paciente.id)}
                        variant={"destructive"}
                      >
                        Apagar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <Separator />
      </div>
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationPrevious
            onClick={() =>
              currentPage !== 0 && setCurrentPage((prevState) => prevState - 1)
            }
          />

          {totalPages.map((_item, index) => (
            <PaginationLink
              key={index}
              onClick={() => setCurrentPage(index)}
              isActive={currentPage === index}
            >
              {index + 1}
            </PaginationLink>
          ))}

          <PaginationNext
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
