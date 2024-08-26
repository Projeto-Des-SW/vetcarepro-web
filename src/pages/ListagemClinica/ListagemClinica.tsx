import { IClinicaList } from "@/interfaces/clinicas";
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
import { useNavigate } from "react-router-dom";

const ListagemClinica = () => {
  const navigate = useNavigate();
  const fetchClinicasList = async (): Promise<IClinicaList[]> => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ClinicaList"],
    queryFn: fetchClinicasList,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching clinics</div>;
  return (
    <div className="flex-wrap gap-2 flex-col">
      <div className="flex justify-between w-full">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Suas clinicas veterinárias
        </h2>
        <Button>Adicionar clinica</Button>
      </div>
      <div className="flex flex-wrap">
        {data?.map((clinica) => (
          <Card key={clinica.id}>
            <CardHeader>
              <CardTitle>{clinica.title}</CardTitle>
              <CardDescription>{clinica.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={() => navigate(`/editarPaciente/${clinica.id}`)}>
                Editar
              </Button>
              <Button>Apagar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListagemClinica;
