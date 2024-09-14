import { IPet } from "@/interfaces/paciente";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { fetchPacientsList } from "@/Services/GetServices";
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
import { handleDeletePacient } from "@/Services/DeleteServices";
import { Separator } from "@/components/ui/separator";

const ListagemPaciente = () => {
  const navigate = useNavigate();
  const { idClinica } = useParams();
  const queryClient = useQueryClient();
  const user = useUserSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const { data, error, isPending } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: () => fetchPacientsList(idClinica, user.token),
  });

  const mutation = useMutation({
    mutationFn: (id?: string) => handleDeletePacient(idClinica, id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PacienteList"] });
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
        Seus pacientes
      </h2>
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
              : totalPages[currentPage]?.map((paciente: IPet) => (
                  <TableRow key={paciente.id}>
                    <TableCell className="font-medium">
                      {paciente.name}
                    </TableCell>
                    <TableCell>{paciente.species}</TableCell>
                    <TableCell>{paciente.age}</TableCell>
                    <TableCell className="flex justify-end gap-2 ">
                      <Button
                        onClick={() =>
                          navigate(`../detailsPaciente/${paciente.id}`)
                        }
                      >
                        Detalhes
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

export default ListagemPaciente;
