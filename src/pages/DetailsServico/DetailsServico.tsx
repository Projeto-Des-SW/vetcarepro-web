import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { IService } from "@/interfaces/servico";

const DetailsServico = () => {
  const baseUrl = import.meta.env.VITE_URL as string;
  const user = useUserSelector((state) => state.user);
  const { id, idClinica } = useParams();
  const navigate = useNavigate();
  console.log(id, idClinica)

  const fetchClinicasList = async (): Promise<IService> => {
    const response = await axios.get(
      `${baseUrl}/clinics/${idClinica}/services/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ServicoDetails"],
    queryFn: fetchClinicasList,
  });

  if (error) return <div>Error fetching clinics</div>;

  return (
    <section className="flex-wrap gap-2 flex-col w-full flex items-center h-[83%]">
      <h1>Service details</h1>
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
          <Card key={data?.id}>
            <CardHeader>
              <CardTitle>{data?.title}</CardTitle>
              <CardDescription>{data?.type}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <p>Quantidade: {data?.amount}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() =>
                  navigate(`/internalClinica/editarServico/${id}/${idClinica}`)
                }
              >
                Editar
              </Button>
              <Button>Apagar</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DetailsServico;
