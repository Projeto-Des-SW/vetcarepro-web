import { IPet, ITemp } from "@/interfaces/paciente";
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

const ListagemPaciente = () => {
  const navigate = useNavigate();
  const fetchClinicasList = async (): Promise<ITemp[]> => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: fetchClinicasList,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching clinics</div>;
  return (
    <section className="flex-wrap gap-2 flex-col">
      <h1>Listagem dos pacientes</h1>
      <div className="flex flex-wrap gap-2">
        {data?.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <CardTitle>{pet.title}</CardTitle>
              <CardDescription>{pet.title}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={() => navigate(`/editarPaciente/${pet.id}`)}>
                Editar
              </Button>
              <Button>Apagar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ListagemPaciente;
