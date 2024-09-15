import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { IService } from "@/interfaces/servico";
import { fetchServiceItemList } from "@/services/GetServices";
import { Separator } from "@/components/ui/separator";
import * as dayjs from "dayjs";

const DetailsServico = () => {
  const baseUrl = import.meta.env.VITE_URL as string;
  const user = useUserSelector((state) => state.user);
  const { id, idClinica } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar este serviço?")) {
      try {
        await axios.delete(`${baseUrl}/clinics/${idClinica}/services/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        navigate(`internalClinica/${idClinica}/dashboard`);
      } catch (error) {
        console.error("Erro ao deletar o serviço", error);
      }
    }
  };

  const { data, error, isLoading } = useQuery<IService>({
    queryKey: ["ServicoDetails"],
    queryFn: () => fetchServiceItemList(idClinica, id, user.token),
  });

  if (error) return <div>Error fetching service details</div>;

  return (
    <section className="flex-wrap gap-2 flex-col w-full flex items-center h-[83%]">
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
            <main className="flex-1">
              <section className="w-full">
                <div className="flex w-full flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Detalhes do Serviço</h1>
                    <div className="flex gap-5">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`../editarServico/${id}`)}
                      >
                        Editar
                      </Button>
                      <Button onClick={handleDelete} variant="destructive">
                        Apagar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-1 gap-8 min-w-[1000px] w-full">
                    <div className="p-6 rounded-lg shadow-md">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">
                            Informações do Serviço
                          </h3>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Título:</span>
                            <span>{data?.title}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Tipo:</span>
                            <span>{data?.type}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Preço:</span>
                            <span>{data?.amount}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-medium">Criado em:</span>
                            <span>
                              {dayjs(data?.created_at).format(
                                "DD/MM/YYYY - HH:mm"
                              )}
                            </span>
                          </div>
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

export default DetailsServico;
