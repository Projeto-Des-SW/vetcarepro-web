import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
import {
  fetchFuncionariosList,
  fetchPacientsList,
  fetchServiceList,
} from "@/services/getServices";
import { AgendamentoSchema } from "@/utils/schemas.utils";
import BreadcrumbContainer from "@/components/BreadcrumbContainer/BreadcrumbContainer";

const AgendarConsulta = ({ mode = "create" }: { mode?: "create" | "edit" }) => {
  const { idClinica, id } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState("");

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(AgendamentoSchema),
  });
  const errorCount = Object.keys(errors).length;
  console.log(errors);

  const { data: pacientes, isLoading: loadingPacientes } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: () => fetchPacientsList(idClinica, user.token),
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["ServicoList"],
    queryFn: () => fetchServiceList(idClinica, user.token),
  });

  const { data: funcionario, isLoading: loadingFuncionario } = useQuery({
    queryKey: ["FuncionarioList"],
    queryFn: () => fetchFuncionariosList(idClinica, user.token),
  });

  const handleSubmitAgendamento: SubmitHandler<any> = (data) => {
    console.log(data);

    const selectedDate = new Date(data.date);
    const [hours, minutes] = data.horario.split(":");

    selectedDate.setHours(Number(hours));
    selectedDate.setMinutes(Number(minutes));

    const formattedData = {
      patient_id: data.patient_id,
      service_id: data.service_id,
      clinic_id: data.clinic_id,
      employee_id: data.employee_id,
      date: format(selectedDate, "yyyy-MM-dd HH:mm:ss"),
    };

    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/schedules`
        : `${baseUrl}/clinics/${idClinica}/schedules/${id}`;

    axios({
      method: mode === "create" ? "POST" : "PUT",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      data: formattedData,
    })
      .then((_response) => {
        const successMessage = `Agendamento ${
          mode === "create" ? "criado" : "atualizado"
        } com sucesso`;
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;

        dispatch(
          addNotification({
            title: successMessage,
            description: successDescription,
          })
        );
      })
      .catch((error) => {
        const errorMessage = "Erro ao agendar";
        const errorDescription = `Erro: ${error.message}, Data: ${formattedDate}, Hora: ${formattedTime}`;

        toast.error(errorMessage, {
          description: errorDescription,
        });

        dispatch(
          addNotification({
            title: errorMessage,
            description: errorDescription,
          })
        );

        console.error("Erro ao enviar o formulário:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorForm(error.response.data.message);
        } else {
          setErrorForm(
            "Ocorreu um erro inesperado. Por favor, tente novamente."
          );
        }
      });
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`${baseUrl}/clinics/${idClinica}/schedules/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          const employeesData = response.data;
          reset(employeesData);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da clínica:", error);
        });
    }
  }, [mode, id, reset, user.token, baseUrl]);

  if (loadingPacientes && loadingServices && loadingFuncionario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="h-fit">
      <BreadcrumbContainer
        bcItems={[
          { path: "/home", title: "Home" },
          { path: "/dashboard/listagemClinica", title: "Dashboard" },
          {
            path: `/internalClinica/${idClinica}/dashboard`,
            title: "Minha Clinica",
          },
          {
            path: `/internalClinica/${idClinica}/listagemAgendamento`,
            title: "Meus Agendamentos",
          },
        ]}
        page="Novo Agendamento"
        title="Novo agendamento"
        size={services.length}
      />
      <Card
        className={`${
          user.isDarkMode ? "dark" : "bg-white/90"
        } flex p-8 w-fit  backdrop-blur-sm rounded-2xl shadow-2xl h-fit items-center gap-4`}
      >
        {" "}
        <form
          onSubmit={handleSubmit(handleSubmitAgendamento)}
          className="flex flex-col w-[500px] gap-4"
        >
          <header className="text-center m-4">
            <div className="inline-block bg-primary rounded-full p-4 mb-6 shadow-lg">
              <Newspaper className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {mode === "create" ? "Agendamento" : "Edição"} de consulta
            </h1>
            <p className="text-gray-600">
              Gerencie as informações da sua clínica
            </p>
          </header>

          <div className="flex gap-2">
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
                      <SelectItem key={paciente.id} value={paciente.id || ""}>
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
                      <SelectItem key={service.id} value={service.id || ""}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.service_id && <p>{errors.service_id.message}</p>}
          </div>

          <div className="flex gap-2">
            <Controller
              name="employee_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionario" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionario
                      ?.filter((item) => item.role === "VETERINARY")
                      .map((service) => (
                        <SelectItem key={service.id} value={service.id || ""}>
                          {service.name}
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
                        "justify-start text-left font-normal w-full min-w-[100px]" +
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
                      disabled={{ before: new Date() }}
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
          </div>

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
                  <div className="flex flex-wrap gap-4 ">
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
        <p>{errorForm}</p>
        <div className="flex flex-col items-center justify-center">
          <img
            src={
              errorCount == 1 ? dogTriste : errorCount > 0 ? dogPuto : dogHappy
            }
            alt="Status do formulário"
            className="w-full max-w-[400px] h-auto"
          />
          <p className="text-center mt-4 font-semibold">
            {errorCount == 1
              ? "Corrige esse erro ..."
              : errorCount > 0
              ? "Quantos erros, me ajuda ai!"
              : "Tudo certo, como deve ser!"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AgendarConsulta;
