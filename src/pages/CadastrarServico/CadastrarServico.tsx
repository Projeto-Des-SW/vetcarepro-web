import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "@/components/Inputs/Inputs";
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

const petSchema = yup
  .object({
    clinic_id: yup.string(),
    title: yup.string().required("Pet name is required"),
    type: yup.string().required("Species is required"),
    amount: yup.string().required("Age is required"),
  })
  .required();

const CadastrarServico = ({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) => {
  const { idClinica, id } = useParams();
  console.log(id, idClinica);
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do serviço:", error);
        });
    }
  }, [mode, reset, user.token, baseUrl]);

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
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

    axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      data: requestData,
    })
      .then(() => {
        toast("Cadastro realizado com sucesso", {
          description: `Data: ${formattedDate}, Hora: ${formattedTime}`,
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
      });
  };

  return (
    <Card className="flex p-8 w-fit items-center gap-4">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col items w-[500px] gap-4 justify-center"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} o serviço</h1>

        <div className="flex gap-4">
          <Inputs
            label="Nome do serviço"
            name="title"
            placeholder="Digite o nome do serviço"
            register={register}
            error={errors}
            className="w-full"
          />
          <Inputs
            label="Tipo de serviço"
            name="type"
            placeholder="Digite o tipo do serviço"
            register={register}
            error={errors}
          />
        </div>

        <Inputs
          label="Quantidade"
          name="amount"
          type="number"
          placeholder="Digite a quantidade"
          register={register}
          error={errors}
        />

        <Button type="submit">
          {mode === "create" ? "Criar" : "Salvar alterações"}
        </Button>
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
