import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "dayjs/locale/es";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import dayjs from "dayjs";
import {
  fetchAgendamentosList,
  fetchClinicaDetails,
  fetchFinanceiro,
  fetchPacientsList,
  fetchServiceList,
} from "@/services/getServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import {
  INTERVAL_TIME,
  PROGRESS_INCREMENT,
  splitIntoGroups,
} from "@/utils/const.utils";
import {
  Pagination,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PIX from "react-qrcode-pix";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PixIcon from "@mui/icons-material/Pix";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";

const DashboardClinica = () => {
  const [searchConsulta, setSearchConsulta] = useState("");
  const [searchServices, setSearchServices] = useState("");
  const [isExibirLucro, setIsExibirLucro] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [currentPageServices, setCurrentPageServices] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [itemsPerPageServices, setItemsPerPageServices] = useState(5);
  const [tourRunning, setTourRunning] = useState(false);
  const [openPix, setOpenPix] = useState(false);
  const [valuePix, setValuePix] = useState<number>();
  const baseUrl = import.meta.env.VITE_URL as string;
  const { idClinica } = useParams();
  const user = useUserSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [steps] = useState<Step[]>([
    {
      target: ".total-pacientes-card",
      content:
        "Aqui você pode ver o total de pacientes cadastrados na clínica.",
    },
    {
      target: ".proximas-consultas-card",
      content:
        "Veja suas próximas consultas aqui. As suas proximas 5 consultas serão exibidas aqui com um intervalo de 10 segundos entre elas",
    },
    {
      target: ".lucro-card",
      content:
        "Confira o lucro da clínica neste card. Atualmente, o valor é incrementado conforme a data das consultas vão chegando. Em breve você terá um painel de financeiro para gerenciar seus custos e lucros!",
    },
    {
      target: ".consultas-tabela",
      content: "Aqui você pode visualizar e pesquisar suas consultas.",
    },
    {
      target: ".consultas-service",
      content:
        "Aqui você pode visualizar e pesquisar os serviços oferecidos por sua clinica, para facilitar o seu dia a dia!",
    },
  ]);

  useEffect(() => {
    if (
      localStorage.getItem("joyride") ||
      localStorage.getItem("joyrideMenu")
    ) {
      return;
    } else {
      localStorage.setItem("joyride", "primeira vez");
      setTourRunning(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setTourRunning(false);
    }
  };

  const handleWhatsapp = (numero: number, mensagem: string) => {
    const editedNumber = `+55${numero}`;
    let target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      editedNumber
    )}&text=${encodeURIComponent(mensagem)}`;

    window.open(target, "_blank");
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgressBar((prevState) =>
        prevState >= 100 ? 0 : prevState + PROGRESS_INCREMENT
      );
    }, 100);

    const carouselInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 4 ? 0 : prevIndex + 1));
      setProgressBar(0);
    }, INTERVAL_TIME);

    return () => {
      clearInterval(progressInterval);
      clearInterval(carouselInterval);
    };
  }, []);

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

  const { data: services, isPending: isPendingServices } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: () => fetchServiceList(idClinica, user.token),
  });

  const { data: financas, isPending: pendingFinancas } = useQuery({
    queryKey: ["financeiro"],
    queryFn: () => fetchFinanceiro(idClinica, user.token),
  });

  const { data: dataDetailsClinica, isPending: isPendingDetailsClinica } =
    useQuery({
      queryKey: ["ClinicDetails"],
      queryFn: () => fetchClinicaDetails(idClinica, user.token),
    });

  const mutationConsulta = useMutation({
    mutationFn: async ({
      patient_id,
      service_id,
      clinic_id,
      employee_id,
      date,
      id,
    }: {
      patient_id: string;
      service_id: string;
      clinic_id: string;
      employee_id: string;
      date: string;
      id: string;
    }) => {
      const response = await axios.put(
        `${baseUrl}/clinics/${clinic_id}/schedules/${id}`,
        {
          patient_id,
          service_id,
          clinic_id,
          employee_id,
          date: date,
          status_schedule: "FINISHED",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["AgendamentosListInternal"] });
      queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      dispatch(
        addNotification({
          title: "Consulta concluida",
          description: "A consulta foi concluida com sucesso",
        })
      );
    },
    onError: (error) => {
      console.error("Erro:", error);
    },
  });

  if (
    isPendingAgendamentos ||
    isPendingServices ||
    isPendingPacientes ||
    pendingFinancas
  ) {
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <Skeleton className="h-16 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-10 w-1/2" />

        {Array.from({ length: 1 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  const totalPages = Array.isArray(dataAgendamentos)
    ? splitIntoGroups(
        (dataAgendamentos ?? [])
          .sort(
            (a, b) => dayjs(a.date).diff(dayjs()) - dayjs(b.date).diff(dayjs())
          )
          .filter(
            (value) =>
              !dayjs(value.date).isBefore(dayjs()) &&
              value.status_schedule !== "FINISHED"
          ),
        itemsPerPage
      )
    : dataAgendamentos
    ? [dataAgendamentos]
    : [];

  const totalPagesService = splitIntoGroups(
    services as any,
    itemsPerPageServices
  );

  return (
    <section className={`flex h-full w-full overflow-y-auto `}>
      <Dialog
        open={openPix}
        onOpenChange={() => setOpenPix((prevState) => !prevState)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento via pix</DialogTitle>
            <DialogDescription className="flex items-center gap-2 flex-col">
              {!user.chavePix ? (
                <p>Chave pix não cadastrada</p>
              ) : (
                <p>Leia o QR code para realizar o pagamento</p>
              )}
              <PIX
                pixkey={user.chavePix || ""}
                merchant="Pedro"
                city="Feira Nova"
                amount={valuePix}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Joyride
        steps={steps}
        continuous
        showSkipButton
        run={tourRunning}
        callback={handleJoyrideCallback}
      />
      <main className="flex-1 flex flex-col">
        <BreadcrumbContainer
          bcItems={[
            { path: "/home", title: "Home" },
            { path: "/dashboard/listagemClinica", title: "Dashboard" },
          ]}
          page={
            !isPendingDetailsClinica ? (
              dataDetailsClinica.title
            ) : (
              <Skeleton className="h-3 w-32" />
            )
          }
          title="Seus Produtos"
        />

        <div className="grid grid-cols-3 gap-8">
          <Card className="flex flex-col justify-center total-pacientes-card ">
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
            <CardHeader className="pb-0">
              <CardTitle className="flex justify-between items-center ">
                Proximas consultas
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccessAlarmIcon className="proximas-consultas-card" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-xs p-2 text-sm"
                    >
                      Suas próximas 5 consultas serão apresentadas abaixo com
                      intervalos de 10 segundos entre cada consulta. Para mais
                      detalhes, veja no quadro de consultas.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPendingAgendamentos ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <Carousel className="flex flex-col gap-2">
                    <CarouselContent>
                      {totalPages[0] !== undefined ? (
                        totalPages[0].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: currentIndex === index ? 1 : 0,
                              y: 0,
                            }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className={`${
                              currentIndex === index
                                ? "block"
                                : currentIndex !== index
                                ? "hidden"
                                : "block"
                            } pl-4`}
                          >
                            Paciente: {item.patient.name} -{" "}
                            {dayjs(item.date).format("DD/MM/YYYY - HH:mm")}
                            {dayjs(item.date).diff(dayjs(), "days") === 0 ? (
                              dayjs(item.date).diff(dayjs(), "hours") === 0 ? (
                                <p className="text-red-500">
                                  Quando: Em{" "}
                                  {dayjs(item.date).diff(dayjs(), "minutes")}{" "}
                                  minutos
                                </p>
                              ) : (
                                <p className="text-orange-500">
                                  Quando: Em{" "}
                                  {dayjs(item.date).diff(dayjs(), "hours")}{" "}
                                  horas
                                </p>
                              )
                            ) : (
                              <p className="text-green-500">
                                Quando: Em{" "}
                                {dayjs(item.date).diff(dayjs(), "days")} dias
                              </p>
                            )}
                            <Progress value={progressBar} />
                          </motion.div>
                        ))
                      ) : (
                        <p className="m-4">Sem dados</p>
                      )}
                    </CarouselContent>
                  </Carousel>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Lucro
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AttachMoneyIcon className="lucro-card" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-xs p-2 text-sm"
                    >
                      O seu lucro bruto é exibido abaixo. Para fins de
                      praticidade, o valor é ajustado após a data da consulta
                      ter sido atingida. Para consultar quanto cada consulta
                      rendeu, acesse a listagem de consultas. Em breve teremos
                      uma dashboard financeira detalhada disponivel.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-center">
              <div className="text-4xl font-bold">
                {isExibirLucro
                  ? `R$ ${financas.totalValueSchedulesFinished.toFixed(2)}`
                  : "R$ *****"}
              </div>

              {!isExibirLucro ? (
                <VisibilityIcon
                  onClick={() => setIsExibirLucro((prevState) => !prevState)}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setIsExibirLucro((prevState) => !prevState)}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8">
          <Card className="consultas-tabela">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Consultas</CardTitle>{" "}
                  <input
                    type="text"
                    className={`${
                      user.isDarkMode ? "bg-gray-900" : "bg-transparent"
                    } placeholder-gray-500 text-gray-900 p-2 mt-2 rounded-md dark:text-white`}
                    placeholder="Pesquisar consultas"
                    onChange={(e) => setSearchConsulta(e.target.value)}
                  />
                </div>

                <div className="min-w-[140px]">
                  <Select
                    onValueChange={(value) => setItemsPerPage(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Consultas por página" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        key={5}
                        value="5"
                        disabled={
                          !(
                            Array.isArray(dataAgendamentos) &&
                            dataAgendamentos.length >= 5
                          )
                        }
                      >
                        5
                      </SelectItem>
                      <SelectItem
                        key={7}
                        value="7"
                        disabled={
                          !(
                            Array.isArray(dataAgendamentos) &&
                            dataAgendamentos.length >= 7
                          )
                        }
                      >
                        7
                      </SelectItem>
                      <SelectItem
                        key={10}
                        value="10"
                        disabled={
                          !(
                            Array.isArray(dataAgendamentos) &&
                            dataAgendamentos.length >= 10
                          )
                        }
                      >
                        10
                      </SelectItem>
                      <SelectItem
                        key={20}
                        value="20"
                        disabled={
                          !(
                            Array.isArray(dataAgendamentos) &&
                            dataAgendamentos.length >= 20
                          )
                        }
                      >
                        20
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ação</TableHead>
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
                          onClick={() => navigate(`../listagemAgendamento`)}
                          className="cursor-pointer"
                        >
                          {dayjs(item.date).format("DD/MM/YYYY - HH:mm")}
                        </TableCell>
                        <TableCell>{item.patient.name}</TableCell>
                        <TableCell>
                          {item.service.title} -{" "}
                          {parseFloat(item.service.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {dayjs(item.date).diff(dayjs(), "days") === 0 ? (
                            dayjs(item.date).diff(dayjs(), "hours") === 0 ? (
                              <p className="text-red-500">
                                Em {dayjs(item.date).diff(dayjs(), "minutes")}{" "}
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
                              Em {dayjs(item.date).diff(dayjs(), "days")} dias
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleWhatsapp(
                                      item.patient.guardian_contact,
                                      "ola"
                                    )
                                  }
                                >
                                  <WhatsAppIcon />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Enviar mensagem</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  disabled={user.tier !== "TIER_THREE"}
                                  onClick={() => {
                                    setValuePix(
                                      parseFloat(item.service.amount)
                                    );
                                    setOpenPix((prevState) => !prevState);
                                  }}
                                >
                                  <PixIcon />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Pagar com PIX</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    mutationConsulta.mutate({
                                      patient_id: item.patient_id,
                                      service_id: item.service_id,
                                      clinic_id: item.clinic_id,
                                      employee_id: item.employee_id,
                                      date: item.date,
                                      id: item.id,
                                    });
                                  }}
                                >
                                  <AssignmentTurnedInOutlinedIcon />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Concluir consulta</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                    currentPage !== totalPages[0].length - 1 &&
                    setCurrentPage((prevState) => prevState + 1)
                  }
                />
              </Pagination>
            </div>
          </Card>
        </div>
        <div className="mt-8">
          <Card className="mb-12 consultas-service">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Serviços disponiveis</CardTitle>
                  <input
                    type="text"
                    className={`${
                      user.isDarkMode ? "bg-gray-900" : "bg-transparent"
                    } placeholder-gray-500 text-gray-900 p-2 mt-2 rounded-md dark:text-white`}
                    placeholder="Pesquisar serviços"
                    onChange={(e) => setSearchServices(e.target.value)}
                  />
                </div>

                <div className="min-w-[140px]">
                  <Select
                    onValueChange={(value) =>
                      setItemsPerPageServices(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Serviços por página" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        key={5}
                        value="5"
                        disabled={
                          !Array.isArray(services) || services.length < 5
                        }
                      >
                        5
                      </SelectItem>
                      <SelectItem
                        key={7}
                        value="7"
                        disabled={
                          !Array.isArray(services) || services.length < 7
                        }
                      >
                        7
                      </SelectItem>
                      <SelectItem
                        key={10}
                        value="10"
                        disabled={
                          !Array.isArray(services) || services.length < 10
                        }
                      >
                        10
                      </SelectItem>
                      <SelectItem
                        key={20}
                        value="20"
                        disabled={
                          !Array.isArray(services) || services.length < 20
                        }
                      >
                        20
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                        onClick={() => navigate(`../detailsServico/${item.id}`)}
                        className="cursor-pointer"
                      >
                        {item.title}
                      </TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        {parseFloat(item.amount).toFixed(2)}
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
        </div>
      </main>
    </section>
  );
};

export default DashboardClinica;
