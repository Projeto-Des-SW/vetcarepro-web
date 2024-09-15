import { IPet } from "@/interfaces/paciente";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { Separator } from "@/components/ui/separator";
import { fetchAgendamentosList } from "@/services/getServices";
import * as dayjs from "dayjs";

const DetailsPaciente = () => {
  const baseUrl = import.meta.env.VITE_URL as string;
  const user = useUserSelector((state) => state.user);
  const { id, idClinica } = useParams();
  const navigate = useNavigate();

  const fetchClinicasList = async (): Promise<IPet> => {
    const response = await axios.get(
      `${baseUrl}/clinics/${idClinica}/patients/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["PacienteDetails"],
    queryFn: fetchClinicasList,
  });

  console.log(data);

  const { data: pacientesConsultas, isLoading: loadingConsultas } = useQuery({
    queryKey: ["AgendamentosListInternal"],
    queryFn: () => fetchAgendamentosList(idClinica, user.token),
  });

  console.log(pacientesConsultas);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar esta clínica?")) {
      try {
        await axios.delete(`${baseUrl}/clinics/${idClinica}/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        navigate("..");
      } catch (error) {
        console.error("Erro ao deletar a clínica", error);
      }
    }
  };

  if (error) return <div>Error fetching clinics</div>;
  if (isLoading || loadingConsultas) return <div>loading</div>;
  return (
    <section className="flex-wrap gap-2 flex-col w-full flex items-center ">
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))
        ) : (
          <section>
            <main className="flex-1 ">
              <section className="w-full">
                <div className="">
                  <div className="grid gap-8 ">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">
                        Detalhes do Paciente
                      </h1>{" "}
                      <div className="flex gap-5">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`../editarPaciente/${id} `)}
                        >
                          Editar
                        </Button>
                        <Button onClick={handleDelete} variant={"destructive"}>
                          Apagar
                        </Button>
                      </div>
                    </div>

                    <Separator />
                    <div className="grid md:grid-cols-2 gap-8 ">
                      <div className=" p-6 rounded-lg shadow-md ">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold">
                              Informações Gerais
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Nome:</span>
                              <span>{data?.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Espécie:</span>
                              <span>{data?.species}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-medium">Idade:</span>
                              <span>{data?.age}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                Tipo sanguineo:
                              </span>
                              <span>{data?.breed}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 rounded-lg shadow-md">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold">
                              Informações do guardião
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Nome:</span>
                              <span>{data?.guardian_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">CPF:</span>
                              <span>{data?.guardian_cpf}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Contato:</span>
                              <span>{data?.guardian_contact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" p-6 rounded-lg shadow-md">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">
                            Histórico Clínico
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {pacientesConsultas
                            ?.filter((value) => value.patient_id === id)
                            .map((item) => (
                              <article className="flex gap-4 flex-col">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      Data da consulta:
                                    </span>
                                    <span>
                                      {dayjs(item.date).format(
                                        "DD/MM/YYYY - HH:mm"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      Serviço prestado
                                    </span>
                                    <span>{item.service.title}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      Data de agendamento
                                    </span>
                                    <span>
                                      {dayjs(item.created_at).format(
                                        "DD/MM/YYYY - HH:mm"
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <Separator />
                              </article>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </section>
        )}
      </div>
    </section>
  );
};

export default DetailsPaciente;
