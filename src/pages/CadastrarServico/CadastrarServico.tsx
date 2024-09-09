import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { IService } from "@/interfaces/servico";
import { useUserSelector } from "@/store/hooks";
import axios from "axios";
import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
import { Card } from "@/components/ui/card";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Inputs from "@/components/Inputs/Inputs";
import { Label } from "@/components/ui/label";

const petSchema = yup
  .object({
    clinic_id: yup.string(),
    title: yup.string().required("Pet name is required"),
    type: yup.string().required("Service type is required"), // Atualize a mensagem para refletir a seleção de serviço
    amount: yup.string().required("Amount is required"),
  })
  .required();

const CadastrarServico = ({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) => {
  const { idClinica, id } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Adicione para definir o valor do campo
  } = useForm<IService>({
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    if (mode === "edit") {
      axios
        .get(`${baseUrl}/clinics/${idClinica}/services/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          const serviceData = response.data;
          reset(serviceData);
          setValue("type", serviceData.type); // Atualize o valor do campo type
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do serviço:", error);
        });
    }
  }, [mode, reset, user.token, baseUrl, setValue, idClinica, id]);

  const errorCount = Object.keys(errors).length;
  const handleSubmitClinica: SubmitHandler<IService> = (data) => {
    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/services`
        : `${baseUrl}/clinics/${idClinica}/services/${id}`;

    const method = mode === "create" ? "POST" : "PUT";

    const requestData = {
      ...data,
      clinic_id: id,
    };

    const notify = (title: string, description: string) => {
      dispatch(
        addNotification({
          title,
          description,
        })
      );
    };

    axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      data: requestData,
    })
      .then((response) => {
        const successMessage = `Serviço - ${response.statusText}`;
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;

        toast(`${mode} realizado com sucesso`, {
          description: successDescription,
        });

        notify(successMessage, successDescription);
      })
      .catch((error) => {
        const errorMessage = "Erro ao cadastrar paciente";
        const errorDescription = `Erro: ${error.message}, Data: ${formattedDate}, Hora: ${formattedTime}`;

        notify(errorMessage, errorDescription);
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

  return (
    <Card className="flex p-8 w-fit h-fit items-center gap-4">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col items w-[500px] gap-4 justify-center"
      >
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {mode === "create" ? "Cadastre" : "Edite"} o serviço
        </h2>

        <div className="flex gap-4">
          <Inputs
            label="Nome do serviço"
            name="title"
            placeholder="Digite o nome do serviço"
            register={register}
            error={errors}
            className="w-full"
          />
          <div className="w-full">
            <Label>Selecine o tipo de serviço</Label>
            <Select onValueChange={(value) => setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="cosmetico" value="cosmetico">
                  Cosmético
                </SelectItem>
                <SelectItem key="vacina" value="vacina">
                  Vacina
                </SelectItem>
                <SelectItem key="consulta" value="consulta">
                  Consulta
                </SelectItem>
                <SelectItem key="exame" value="exame">
                  Exame
                </SelectItem>
                <SelectItem key="cirurgia" value="cirurgia">
                  Cirurgia
                </SelectItem>
                <SelectItem key="outro" value="outro">
                  Outro
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Inputs
          label="Valor"
          name="amount"
          type="number"
          step={0.01}
          placeholder="Digite o valor do serviço"
          register={register}
          error={errors}
        />

        <Button type="submit">
          {mode === "create" ? "Criar" : "Salvar alterações"}
        </Button>

        {errorForm && <div className="text-red-500">{errorForm}</div>}
      </form>
      <picture className="flex h-auto items-center flex-col ">
        <img
          src={
            errorCount == 1 ? dogTriste : errorCount > 0 ? dogPuto : dogHappy
          }
          alt="Imagem de boas-vindas"
        />

        <h1>
          {errorCount == 1
            ? "Corrige esse erro ..."
            : errorCount > 0
            ? "Quantos erros, me ajuda ai!"
            : "Tudo certo, como deve ser!"}
        </h1>
      </picture>
    </Card>
  );
};

export default CadastrarServico;
