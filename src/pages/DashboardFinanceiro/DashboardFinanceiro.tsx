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
import { fetchFuncionariosList } from "@/services/getServices";
import { useUserSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { BarChart, PieChart } from "lucide-react";
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
import { setChavePix } from "@/store/user-slice";
import { toast } from "sonner";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";

const DashboardFinanceiro = () => {
  const { idClinica } = useParams();
  const dispatch = useDispatch();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState({
    id: "",
    name: "",
    salario: "",
  });

  const user = useUserSelector((state) => state.user);

  const [currentChavePix, setCurrentChavePix] = useState(user.chavePix || "");

  const { data, isPending } = useQuery({
    queryKey: ["FuncionariosList"],
    queryFn: () => fetchFuncionariosList(idClinica, user.token),
  });

  const handleCadastrarChavePix = () => {
    toast(`Chave pix cadastrada com sucesso com sucesso`, {
      description: "Sua chave pix foi alterada!",
    });

    dispatch(setChavePix(currentChavePix));
  };

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
            <Button>Pagar</Button>
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

            <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex flex-col items-start justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <DollarSignIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">Receita Total</h3>
                      <p className="text-sm text-muted-foreground">
                        Últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    R$ 125.000,00
                  </div>
                </CardHeader>
                <CardContent className="p-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variação:</span>
                    <span className="text-green-500 font-medium">+12%</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex flex-col items-start justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <CreditCardIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">
                        Contas a Receber
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    R$ 32.500,00
                  </div>
                </CardHeader>
                <CardContent className="p-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variação:</span>
                    <span className="text-red-500 font-medium">-5%</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex flex-col items-start justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <WalletIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">Contas a Pagar</h3>
                      <p className="text-sm text-muted-foreground">
                        Últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    R$ 18.200,00
                  </div>
                </CardHeader>
                <CardContent className="p-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variação:</span>
                    <span className="text-green-500 font-medium">+3%</span>
                  </div>
                </CardContent>
              </Card>
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
                  {/* <Button variant="outline" size="sm" className="text-primary">
                    Ver Detalhes
                  </Button> */}
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
                              {/* <TableCell>{service.amount}</TableCell> */}
                              <TableCell className="flex justify-end gap-2 ">
                                <Button
                                  variant={"secondary"}
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
                <CardHeader className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <BarChartIcon className="h-8 w-8 text-primary" /> */}
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
                      className="text-primary w-fit h-auto flex text-wrap"
                      onClick={handleCadastrarChavePix}
                    >
                      Cadastrar chave
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <PieChartIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">
                        Receita por Serviço
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-primary">
                    Ver Detalhes
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <PieChart className="w-full aspect-square" />
                </CardContent>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    {/* <BarChartIcon className="h-8 w-8 text-primary" /> */}
                    <div>
                      <h3 className="text-lg font-semibold">Folha salarial</h3>
                      <p className="text-sm text-muted-foreground">
                        Últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-primary">
                    Ver Detalhes
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <BarChart className="w-full aspect-[4/3]" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardFinanceiro;
