import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import boasVindas from "../../assets/boasVindas.png";
import superjson from "superjson";
import { useParams } from "react-router-dom";
import { IPet } from "@/interfaces/paciente";
import { useUserSelector } from "@/store/hooks";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { IService } from "@/interfaces/servico";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AgendamentoSchema = yup
  .object({
    clinic_id: yup.string(),
    patient_id: yup.string().required("Patient ID is required"),
    service_id: yup.string().required("Service ID is required"),
    date: yup.date().required("Date is required"),
  })
  .required();

const AgendarConsulta = ({ mode = "create" }: { mode?: "create" | "edit" }) => {
  const { idClinica, id } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(AgendamentoSchema),
  });

  const fetchPacientsList = async (): Promise<IPet[]> => {
    const response = await axios.get(
      `${baseUrl}/clinics/${idClinica}/patients`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return response.data;
  };

  const { data: pacientes, isLoading: loadingPacientes } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: fetchPacientsList,
  });

  const fetchServiceList = async (): Promise<IService[]> => {
    const response = await axios.get(
      `${baseUrl}/clinics/${idClinica}/services`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return response.data;
  };

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: fetchServiceList,
  });

  const handleSubmitClinica: SubmitHandler<any> = (data) => {
    const formData = new FormData();
    formData.append("clinic_id", idClinica!);
    formData.append("date", data.date); // Data será enviada no formato `Date`

    // Append outros campos
    Object.keys(data).forEach((key) => {
      if (key !== "date") {
        formData.append(key, data[key]);
      }
    });

    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/schedules`
        : `${baseUrl}/clinics/${idClinica}/schedules/${id}`;

    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        // Sucesso
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
      });
  };

  if (loadingPacientes && loadingServices) {
    return <p>Carregando...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitClinica)}
      className="flex flex-col items w-[500px] gap-4 justify-center"
    >
      <h1>{mode === "create" ? "Novo" : "Edite seu"} agendamento</h1>

      <Controller
        name="patient_id"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {pacientes?.map((paciente) => (
                <SelectItem key={paciente.id} value={paciente.id}>
                  {paciente.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.patient_id && <p>{errors.patient_id.message}</p>}

      <Controller
        name="service_id"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.service_id && <p>{errors.service_id.message}</p>}

      <Controller
        name="date"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={
                  "w-[280px] justify-start text-left font-normal" +
                  (!value && " text-muted-foreground")
                }
              >
                {value ? (
                  format(new Date(value), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />

      {errors.date && <p>{errors.date.message}</p>}

      <Button type="submit">
        {mode === "create" ? "Criar" : "Salvar alterações"}
      </Button>
    </form>
  );
};

export default AgendarConsulta;
