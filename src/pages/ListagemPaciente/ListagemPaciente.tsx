import { IPet } from "@/interfaces/paciente";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { fetchPacientsList } from "@/services/getServices";
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
import { handleDeletePacient } from "@/services/deleteServices";
import { Separator } from "@/components/ui/separator";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";
import { addNotification } from "@/store/user-slice";
import { useDispatch } from "react-redux";

const ListagemPaciente = () => {
  const navigate = useNavigate();
  const { idClinica } = useParams();
  const queryClient = useQueryClient();
  const user = useUserSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const itemsPerPage = 7;

  const { data, error, isPending } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: () => fetchPacientsList(idClinica, user.token),
  });

  const mutation = useMutation({
    mutationFn: (id?: string) => handleDeletePacient(idClinica, id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PacienteList"] });
      dispatch(
        addNotification({
          title: "Paciente deletado",
          description: `Paciente deletado`,
        })
      );
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
        page="Meus Pacientes"
        title="Seus Pacientes"
        size={isPending ? 0 : data.length}
        buttonName="Novo paciente"
        clickFn={() => navigate("../cadastrarPaciente")}
      />

      <div
        className={`flex flex-wrap gap-2 ${user.isDarkMode && "text-white"} `}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do pet</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Nome do guardião</TableHead>
              <TableHead>Contato do guardião</TableHead>
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
                  (paciente: IPet, index: number) => (
                    <TableRow
                      key={paciente.id}
                      className={index % 2 === 0 && "bg-background"}
                    >
                      <TableCell className="font-medium">
                        {paciente.name}
                      </TableCell>
                      <TableCell>{paciente.species}</TableCell>
                      <TableCell>{paciente.age}</TableCell>
                      <TableCell>{paciente.guardian_name}</TableCell>
                      <TableCell>{paciente.guardian_contact}</TableCell>
                      <TableCell className="flex justify-end gap-2 ">
                        <Button
                          onClick={() =>
                            navigate(`../detailsPaciente/${paciente.id}`)
                          }
                        >
                          <InfoIcon />
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
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    isActive={currentPage === index}
                    className={`${user.isDarkMode && "text-white"}`}
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

export default ListagemPaciente;
