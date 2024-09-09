import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import "dayjs/locale/es";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import dayjs from "dayjs";
import {
  fetchAgendamentosList,
  fetchPacientsList,
  fetchServiceList,
} from "@/Services/GetServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { splitIntoGroups } from "@/utils/const.utils";
import {
  Pagination,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DashboardClinica = () => {
  const { idClinica } = useParams();
  const [isExibirLucro, setIsExibirLucro] = useState(false);
  const user = useUserSelector((state) => state.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageServices, setCurrentPageServices] = useState(0);
  const [searchConsulta, setSearchConsulta] = useState("");
  const [searchServices, setSearchServices] = useState("");
  const itemsPerPage = 5;
  console.log(searchConsulta);

  const { data: listagemPaciente, isPending: isPendingPacientes } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: () => fetchPacientsList(idClinica, user.token),
  });

  const { data: dataAgendamentos, isPending: isPendingAgendamentos } = useQuery(
    {
      queryKey: ["AgendamentosListInternal"],
      queryFn: () => fetchAgendamentosList(idClinica, user.token),
      refetchOnMount: true,
    }
  );

  const {
    data: services,
    error,
    isPending: isPendingServices,
  } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: () => fetchServiceList(idClinica, user.token),
  });

  if (isPendingAgendamentos || isPendingServices) return <div>carregando</div>;

  const totalPages = splitIntoGroups(
    dataAgendamentos
      .sort((a, b) => dayjs(a.date).diff(dayjs()) - dayjs(b.date).diff(dayjs()))
      .filter((value) => !dayjs(value.date).isBefore(dayjs())),
    itemsPerPage
  );
  const totalPagesService = splitIntoGroups(services as any, itemsPerPage);

  const totalProximasConsultas = dataAgendamentos?.filter(
    (value) => !dayjs(value.date).isBefore(dayjs())
  );

  const receitaUsuario = dataAgendamentos?.filter((value) =>
    dayjs(value.date).isBefore(dayjs())
  );

  const myReceita = receitaUsuario?.reduce((total, item) => {
    return total + parseFloat(item.service.amount);
  }, 0);

  console.log(receitaUsuario);
  console.log(dataAgendamentos);

  return (
    <section className="flex h-full">
      <main className="flex-1 bg-background flex flex-col min-w-[80vw]">
        <div className="grid grid-cols-3 gap-8">
          {isPendingPacientes ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total de pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPendingPacientes ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <div className="text-4xl font-bold">
                      {listagemPaciente?.length}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Proximas consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPendingPacientes ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <div className="text-4xl font-bold">
                      {totalProximasConsultas?.length}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Lucro
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex justify-between items-center">
                  <div className="text-4xl font-bold">
                    {isExibirLucro ? `R$ ${myReceita}` : "R$ ********"}
                  </div>

                  {!isExibirLucro ? (
                    <VisibilityIcon
                      onClick={() =>
                        setIsExibirLucro((prevState) => !prevState)
                      }
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() =>
                        setIsExibirLucro((prevState) => !prevState)
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8">
          {isPendingAgendamentos ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="w-fit">
                  <CardTitle>Próximas consultas</CardTitle>{" "}
                  <input
                    type="text"
                    placeholder="Pesquisar consultas"
                    onChange={(e) => setSearchConsulta(e.target.value)}
                  />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(searchConsulta === ""
                        ? totalPages[currentPage]
                        : dataAgendamentos
                      )
                        ?.filter((value) =>
                          searchConsulta !== ""
                            ? value.patient.name
                                .toLocaleLowerCase()
                                .includes(searchConsulta.toLocaleLowerCase())
                            : true
                        )
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell
                              onClick={() =>
                                navigate(`../detailsPaciente/${item.id}`)
                              }
                              className="cursor-pointer"
                            >
                              {dayjs(item.date).format("DD/MM/YYYY - HH:MM")}
                            </TableCell>
                            <TableCell>{item.patient.name}</TableCell>
                            <TableCell>{item.service.title}</TableCell>
                            <TableCell>
                              {dayjs(item.date).diff(dayjs(), "days") === 0 ? (
                                dayjs(item.date).diff(dayjs(), "hours") ===
                                0 ? (
                                  <p className="text-red-500">
                                    Em{" "}
                                    {dayjs(item.date).diff(dayjs(), "minutes")}{" "}
                                    minutos
                                  </p>
                                ) : (
                                  <p className="text-orange-500">
                                    Em {dayjs(item.date).diff(dayjs(), "hours")}{" "}
                                    horas
                                  </p>
                                )
                              ) : (
                                <p className="text-green-500">
                                  Em {dayjs(item.date).diff(dayjs(), "days")}{" "}
                                  dias
                                </p>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>

                <div className="flex justify-center m-4">
                  <Pagination>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage !== 0 &&
                        setCurrentPage((prevState) => prevState - 1)
                      }
                    />

                    {totalPages.map((item, index) => (
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
              </Card>
            </>
          )}
        </div>
        <div className="mt-8">
          {isPendingPacientes ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-4">
              <CardHeader className="w-fit">
                <CardTitle>Serviços disponiveis</CardTitle>
                <input
                  type="text"
                  placeholder="Pesquisar serviços"
                  onChange={(e) => setSearchServices(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Tipo do serviço</TableHead>
                      <TableHead>Valor do serviço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(searchServices === ""
                      ? totalPagesService[currentPageServices]
                      : services?.filter((item) =>
                          item.title
                            .toLocaleLowerCase()
                            .includes(searchServices.toLocaleLowerCase())
                        )
                    )?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          onClick={() =>
                            navigate(`../detailsServico/${item.id}`)
                          }
                          className="cursor-pointer"
                        >
                          {item.title}
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <div className="flex justify-center m-4">
                <Pagination>
                  <PaginationPrevious
                    onClick={() =>
                      currentPageServices !== 0 &&
                      setCurrentPageServices((prevState) => prevState - 1)
                    }
                  />

                  {totalPagesService.map((_item, index) => (
                    <PaginationLink
                      key={index}
                      onClick={() => setCurrentPageServices(index)}
                      isActive={currentPageServices === index}
                    >
                      {index + 1}
                    </PaginationLink>
                  ))}

                  <PaginationNext
                    onClick={() =>
                      currentPageServices !== totalPagesService.length - 1 &&
                      setCurrentPageServices((prevState) => prevState + 1)
                    }
                  />
                </Pagination>
              </div>
            </Card>
          )}
        </div>
      </main>
    </section>
  );
};

export default DashboardClinica;
