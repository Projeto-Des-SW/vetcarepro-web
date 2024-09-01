import { IClinicaList } from "@/interfaces/clinicas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";

const baseUrl = import.meta.env.VITE_URL as string;

const ListagemClinica = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchClinicasList = async (): Promise<IClinicaList[]> => {
    const response = await axios.get(`${baseUrl}/clinics`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ClinicaListagem"],
    queryFn: fetchClinicasList,
  });

  const handleDelete = async (clinicaId: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta clínica?")) {
      try {
        await axios.delete(`${baseUrl}/clinics/${clinicaId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.error("Erro ao deletar a clínica", error);
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data !== undefined && data?.slice(startIndex, endIndex);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  if (error) return <div>Error fetching clinics</div>;

  return (
    <div className="flex-wrap gap-2 flex-col p-4">
      <div className="flex justify-between w-full">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Suas clínicas veterinárias
        </h2>
        <Button onClick={() => navigate("/dashboard/adicionarClinica")}>
          Adicionar clínica
        </Button>
      </div>
      <div className="flex flex-wrap w-[80vw] h-[80vh] gap-4">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <Card key={index} className="w-[30%]">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </CardFooter>
              </Card>
            ))
          : currentItems?.map((clinica) => (
              <Card key={clinica.id} className="w-[30%] h-fit">
                <CardHeader>
                  <CardTitle>{clinica.title}</CardTitle>
                  <CardDescription>{clinica.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <p>{clinica.email}</p>
                  <p>{clinica.phone}</p>
                  <p>{clinica.address}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    onClick={() =>
                      navigate(`/internalClinica/${clinica.id}/dashboard`)
                    }
                  >
                    Visualizar
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/editarClinica/${clinica.id}`)
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(clinica.id)}
                  >
                    Deletar
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > currentPage + 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ListagemClinica;
