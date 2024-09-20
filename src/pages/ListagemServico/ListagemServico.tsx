import axios from "axios";
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
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { fetchServiceList } from "@/services/getServices";
import { splitIntoGroups } from "@/utils/const.utils";
import { useQuery } from "@tanstack/react-query";

const ListagemServico = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_URL as string;
  const { idClinica } = useParams();
  const user = useUserSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const handleDelete = async (idService?: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta clínica?")) {
      try {
        await axios.delete(
          `${baseUrl}/clinics/${idClinica}/services/${idService}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        navigate(`internalClinica/${idClinica}/dashboard`);
      } catch (error) {
        console.error("Erro ao deletar a clínica", error);
      }
    }
  };

  const { data, error, isPending } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: () => fetchServiceList(idClinica, user.token),
  });

  console.log(data);
  if (isPending) return <div>carregando</div>;
  if (error) return <div>Error fetching clinics</div>;

  const totalPages = splitIntoGroups(data, itemsPerPage);
  console.log(currentPage);

  return (
    <section className="flex-wrap gap-2 flex-col w-full">
      <h2
        className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
          user.isDarkMode && "text-white"
        }`}
      >
        {" "}
        Seus serviços
      </h2>
      <div
        className={`flex flex-wrap gap-2 ${user.isDarkMode && "text-white"} `}
      >
        {" "}
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
                      <TableCell>{parseFloat(service.amount).toFixed(2)}</TableCell>
                      <TableCell className="flex justify-end gap-2 ">
                        <Button
                          onClick={() =>
                            navigate(`../detailsServico/${service.id}`)
                          }
                        >
                          Detalhes
                        </Button>
                        <Button
                          onClick={() => handleDelete(service.id)}
                          variant={"destructive"}
                        >
                          Apagar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
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

export default ListagemServico;
