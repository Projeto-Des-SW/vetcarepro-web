import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IFuncionario } from "@/interfaces/funcionario";
import { fetchFinanceiro, fetchFuncionariosList } from "@/services/getServices";
import { useUserSelector } from "@/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { addNotification, setChavePix } from "@/store/user-slice";
import { toast } from "sonner";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const DashboardFinanceiro = () => {
  const { idClinica } = useParams();
  const dispatch = useDispatch();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const user = useUserSelector((state) => state.user);
  const [currentChavePix, setCurrentChavePix] = useState(user.chavePix || "");
  const queryClient = useQueryClient();
  const baseUrl = import.meta.env.VITE_URL as string;
  const [selectedFuncionario, setSelectedFuncionario] = useState({
    id: "",
    name: "",
    salario: "",
  });

  const { data, isPending } = useQuery({
    queryKey: ["FuncionariosList"],
    queryFn: () => fetchFuncionariosList(idClinica, user.token),
  });

  const { data: financas, isPending: pendingFinancas } = useQuery({
    queryKey: ["financeiro"],
    queryFn: () => fetchFinanceiro(idClinica, user.token),
  });

  const handleCadastrarChavePix = () => {
    toast(`Chave pix cadastrada com sucesso`, {
      description: "Sua chave pix foi alterada!",
    });

    dispatch(setChavePix(currentChavePix));
    dispatch(
      addNotification({
        title: "Chave pix cadastrada com sucesso",
        description: "Sua chave pix foi alterada!",
      })
    );
  };

  const mutationPaymentEmployee = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${baseUrl}/clinics/${idClinica}/employees/${selectedFuncionario.id}/payments`,
        { amount: selectedFuncionario.salario },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      queryClient.invalidateQueries({ queryKey: ["FuncionariosList"] });
      setOpenConfirmation(false);
      dispatch(
        addNotification({
          title: "Salario pago com sucesso",
          description: `O pagamento de ${selectedFuncionario.name} foi realizado`,
        })
      );
    },
    onError: (error) => {
      console.error("Erro:", error);
    },
  });

  if (pendingFinancas || isPending) return <div>Loading</div>;

  const myCards = [
    {
      title: "Vendas",
      value: financas.totalValueSales.toFixed(2),
      color: "text-green-600",
      icon: <AttachMoneyOutlinedIcon sx={{ width: "32px", height: "32px" }} />,
      helperText: "Receita bruta com as suas venda",
    },
    {
      title: "Consultas",
      value: financas.totalValueSchedulesFinished.toFixed(2),
      icon: (
        <EventAvailableOutlinedIcon sx={{ width: "32px", height: "32px" }} />
      ),
      color: "text-green-600",
      helperText: "Receita bruta com suas consultas",
    },
    {
      title: "Valor a receber",
      value: financas.totalValueSchedulesPending.toFixed(2),
      icon: (
        <PendingActionsOutlinedIcon sx={{ width: "32px", height: "32px" }} />
      ),
      color: "text-yellow-600",
      helperText: "Receita a receber das suas consultas",
    },
    {
      title: "Receita Total",
      value: (
        financas.totalValueSales +
        financas.totalValueSchedulesFinished -
        financas.totalValuePayments
      ).toFixed(2),
      color: "text-green-600",
      icon: <PointOfSaleOutlinedIcon sx={{ width: "32px", height: "32px" }} />,
      helperText: "Receita bruta das consultas e vendas",
    },
    {
      title: "Debito salarial",
      value: financas.totalValuePayments.toFixed(2),
      icon: <TrendingDownIcon sx={{ width: "32px", height: "32px" }} />,
      color: "text-red-600",
      helperText: "Debito com pagamento com os funcionarios",
    },
  ];

  return (
    <main className="flex-1">
      <Dialog
        open={openConfirmation}
        onOpenChange={() => setOpenConfirmation((prevState) => !prevState)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meus funcionarios</DialogTitle>
            <DialogDescription className="flex flex-col justify-between p-4">
              <p>Você confirma o pagamento do funcionario?</p>
              {selectedFuncionario.name} - {selectedFuncionario.salario}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                mutationPaymentEmployee.mutate();
              }}
            >
              Pagar
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => setOpenConfirmation((prevState) => !prevState)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="w-full pb-14">
        <div className="">
          <div className="grid gap-8 ">
            <BreadcrumbContainer
              bcItems={[
                { path: "/home", title: "Home" },
                { path: "/dashboard/listagemClinica", title: "Dashboard" },
              ]}
              page="Minhas Finanças"
              title="Painel Financeiro"
            />

            <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {myCards.map((card, index) => (
                <Card className="bg-background shadow-lg" key={index}>
                  <CardHeader className="flex flex-col items-start justify-between p-6">
                    <div className="flex items-center gap-4">
                      {card.icon}
                      <div>
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold  ${
                        card.value > 0 && card.color
                      }`}
                    >
                      R$ {card.value}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        <InfoOutlinedIcon />
                      </span>
                      <span className="text-xs font-medium">
                        {card.helperText}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="">
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <BarChartIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">Folha salarial</h3>
                      <p className="text-sm text-muted-foreground">
                        Pagamento dos seus funcionarios
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Salario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isPending
                        ? Array.from({ length: 5 }).map((_, index) => (
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
                        : data?.map((service: IFuncionario) => (
                            <TableRow key={service.id}>
                              <TableCell className="font-medium">
                                {service.name}
                              </TableCell>
                              <TableCell>{service.email}</TableCell>
                              <TableCell>{service.position}</TableCell>
                              <TableCell>{service.salary}</TableCell>
                              <TableCell className="flex justify-end gap-2 ">
                                <Button
                                  variant={"secondary"}
                                  disabled={
                                    service.last_payment_date === null
                                      ? false
                                      : dayjs().diff(
                                          dayjs(service.last_payment_date),
                                          "month"
                                        ) <= 1
                                  }
                                  onClick={() => {
                                    setOpenConfirmation(true);
                                    setSelectedFuncionario({
                                      id: service.id || "",
                                      name: service.name,
                                      salario: service.salary,
                                    });
                                  }}
                                >
                                  Pagar funcionario
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-background shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Chave pix</h3>
                      <p className="text-sm text-muted-foreground">
                        Cadastre ou altere a chave pix para receber sua receita
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Input
                      value={currentChavePix}
                      className="w-2/3"
                      onChange={(e) => setCurrentChavePix(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCadastrarChavePix}
                    >
                      Cadastrar chave
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardFinanceiro;
