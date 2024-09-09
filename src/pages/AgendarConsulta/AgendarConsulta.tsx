import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

const AgendamentoSchema = yup
  .object({
    clinic_id: yup.string(),
    patient_id: yup.string().required("Patient ID is required"),
    service_id: yup.string().required("Service ID is required"),
    date: yup.date().required("Date is required"),
    horario: yup.string().required(),
  })
  .required();

const AgendarConsulta = ({ mode = "create" }: { mode?: "create" | "edit" }) => {
  const { idClinica, id } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AgendamentoSchema),
  });

  console.log(errors);

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
    console.log(data);

    const selectedDate = new Date(data.date);
    const [hours, minutes] = data.horario.split(":");

    selectedDate.setHours(Number(hours));
    selectedDate.setMinutes(Number(minutes));

    const formattedData = {
      ...data,
      date: format(selectedDate, "yyyy-MM-dd HH:mm:ss"),
    };

    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/schedules`
        : `${baseUrl}/clinics/${idClinica}/schedules/${id}`;

    axios
      .post(url, formattedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
      });
  };

  if (loadingPacientes && loadingServices) {
    return <p>Carregando...</p>;
  }

  return (
    <Card className="flex p-8 w-fit h-fit items-center gap-4">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col items w-[500px] gap-4 justify-center"
      >
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {mode === "create" ? "Novo" : "Edite seu"} agendamento
        </h2>

        <Controller
          name="patient_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes?.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id || ''}>
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço a ser prestado" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id || ''}>
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
                    "justify-start text-left font-normal" +
                    (!value && " text-muted-foreground")
                  }
                >
                  {value ? (
                    format(new Date(value), "PPP")
                  ) : (
                    <span>Selecione a data da consulta</span>
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

        <Controller
          name="horario"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              className="flex items-center justify-center flex-col"
            >
              <h1>Selecione um horário</h1>
              <div className="flex gap-4">
                <div className="flex flex-wrap gap-4">
                  {[
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                  ].map((time) => (
                    <div key={time}>
                      <label
                        htmlFor={time}
                        className={`px-4 py-2 border flex justify-center w-[100px] items-center rounded-lg cursor-pointer transition-all ${
                          field.value === time
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        <RadioGroupItem
                          value={time}
                          id={time}
                          className="hidden"
                        />
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </RadioGroup>
          )}
        />

        {errors.date && <p>{errors.date.message}</p>}

        <Button type="submit">
          {mode === "create" ? "Criar" : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
};

export default AgendarConsulta;
