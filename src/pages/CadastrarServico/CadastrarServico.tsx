import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "@/components/Inputs/Inputs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import boasVindas from "../../assets/boasVindas.png";
import { useParams } from "react-router-dom";
import { IService } from "@/interfaces/servico";
import { useUserSelector } from "@/store/hooks";
import axios from "axios";

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
    reset, // Usado para resetar os valores do formulário
  } = useForm<IService>({
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    if (mode === "edit") {
      axios
        .get(`${baseUrl}/clinics/${id}/services`, {
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

  const handleSubmitClinica: SubmitHandler<IService> = (data) => {
    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${id}/services`
        : `${baseUrl}/services/${id}/services/${idClinica}`;

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
      .then((response) => {
        toast("Cadastro realizado com sucesso", {
          description: `Data: ${formattedDate}, Hora: ${formattedTime}`,
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
      });
  };

  return (
    <section className="flex w-full gap-4 justify-center">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col items w-[500px] gap-4 justify-center"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} o serviço</h1>

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
      <img src={boasVindas} alt="Imagem de boas-vindas" />
    </section>
  );
};

export default CadastrarServico;
