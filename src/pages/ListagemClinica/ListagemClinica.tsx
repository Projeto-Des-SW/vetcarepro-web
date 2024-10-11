import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { fetchClinicasList } from "@/services/getServices";
import { handleDeleteClinic } from "@/services/deleteServices";
import { PawPrintIcon } from "lucide-react";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";

const ListagemClinica = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, error, isPending } = useQuery({
    queryKey: ["ClinicaListagem"],
    queryFn: () => fetchClinicasList(user.token),
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data?.slice(startIndex, endIndex);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  if (error) return <div>Error fetching clinics</div>;

  const mutation = useMutation({
    mutationFn: (serviceId: string) =>
      handleDeleteClinic(serviceId, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ClinicaListagem"] });
      dispatch(
        addNotification({
          title: "Clinica deletada",
          description: `Clinica deletada`,
        })
      );
    },
  });

  return (
    <div className="flex-wrap gap-2 flex-col p-4 ml-[-50px]">
      <BreadcrumbContainer
        bcItems={[{ path: "/home", title: "Home" }]}
        title="Suas clínicas veterinárias"
        size={isPending ? 0 : data.length}
        buttonName={user.role !== "MANAGER" ? undefined : "Nova clinica"}
        clickFn={() => navigate("/dashboard/cadastrarClinica")}
      />
      <div className="flex flex-wrap w-[80vw] h-[80vh] gap-4">
        {isPending
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
          : currentItems?.map((clinica, index) => (
              <div key={index}>
                <Card
                  className="h-fit max-h-[300px] max-w-[600px]"
                  key={index * 2}
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <PawPrintIcon />
                      <div className="max-w-[350px]">
                        <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                          {clinica.title}
                        </h3>
                        <p className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                          {clinica.description}
                        </p>
                      </div>
                      {(user.role === "MANAGER" || user.role === "DONO") && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/dashboard/editarClinica/${clinica.id}`)
                          }
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 flex flex-col ">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">Telefone: </span>
                        <span>{clinica.phone}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">Email: {""} </span>
                        <span>{clinica.email}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">Endereço: </span>
                        <span>{clinica.address}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-center w-full">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        navigate(`/internalClinica/${clinica.id}/dashboard`)
                      }
                    >
                      Ver Detalhes
                    </Button>
                    {(user.role === "MANAGER" || user.role === "DONO") && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => mutation.mutate(clinica.id)}
                      >
                        Deletar
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ))}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`${user.isDarkMode && "text-white"}`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  className={`${user.isDarkMode && "text-white"}`}
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
                className={`${user.isDarkMode && "text-white"}`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ListagemClinica;
