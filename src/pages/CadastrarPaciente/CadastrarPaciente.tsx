import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "@/components/Inputs/Inputs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IPet } from "@/interfaces/paciente";
import { ICrud } from "@/interfaces/clinicas";
import { useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
import { Card } from "@/components/ui/card";
import { Heart, PawPrint } from "lucide-react";
import { PencilOff } from "lucide-react";

import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
const petSchema = yup
  .object({
    clinic_id: yup.string(),
    name: yup.string().required("Pet name is required"),
    species: yup.string().required("Species is required"),
    age: yup.string().required("Age is required"),
    breed: yup.string().required("Breed is required"),
    guardian_name: yup.string().required("Guardian name is required"),
    guardian_cpf: yup
      .string()
      .required("Guardian CPF is required")
      .matches(/^\d{11}$/, "Invalid CPF format"),
    guardian_contact: yup
      .string()
      .required("Guardian contact is required")
      .matches(/^\d{10,11}$/, "Invalid contact number"),
  })
  .required();

const CadastrarPaciente = ({ mode = "create" }: ICrud) => {
  const { id, idClinica } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const dispatch = useDispatch();
  const [errorForm, setErrorForm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPet>({
    resolver: yupResolver(petSchema),
  });
  const errorCount = Object.keys(errors).length;
  useEffect(() => {
    if (mode === "edit" && id && idClinica) {
      axios
        .get(`${baseUrl}/clinics/${idClinica}/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          const petData = response.data;
          reset(petData);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do paciente:", error);
        });
    }
  }, [mode, id, idClinica, reset, user.token, baseUrl]);

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  const handleSubmitPaciente: SubmitHandler<IPet> = (data) => {
    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/patients`
        : `${baseUrl}/clinics/${idClinica}/patients/${id}`;

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
        const successMessage = `Paciente - ${response.statusText}`;
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
    <div className="h-fit">
      <Card className="flex p-8 w-fit bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl h-fit items-center gap-4">
        <form
          onSubmit={handleSubmit(handleSubmitPaciente)}
          className="flex flex-col w-[500px] gap-4"
        >
          <header className="text-center m-4">
            <div className="inline-block bg-primary rounded-full p-4 mb-6 shadow-lg">
              <PawPrint className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {mode === "create" ? "Cadastro" : "Edição"} de Paciente
            </h1>
            <p className="text-gray-600">
              Cuidando com amor do seu melhor amigo
            </p>
          </header>
          {/* <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
            {mode === "create" ? (
              <Heart className="w-6 h-6 mr-2 text-red-500" />
            ) : (
              <PencilOff className="w-6 h-6 mr-2 text-red-500" />
            )}
            {mode === "create" ? "Cadastre" : "Edite"} o paciente
          </h2> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Nome do pet"
              name="name"
              placeholder="Digite o nome do pet"
              register={register}
              error={errors}
              className="w-full"
            />
            <Inputs
              label="Digite a espécie"
              name="species"
              placeholder="Digite a espécie"
              register={register}
              error={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Digite a idade"
              name="age"
              type="number"
              placeholder="Digite a idade"
              register={register}
              error={errors}
            />
            <Inputs
              label="Digite o tipo sanguíneo"
              name="breed"
              placeholder="Digite o tipo sanguíneo"
              register={register}
              error={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Nome do guardião"
              name="guardian_name"
              register={register}
              placeholder="Digite o nome do guardião"
              error={errors}
              type="text"
            />
            <Inputs
              label="CPF do guardião"
              name="guardian_cpf"
              register={register}
              placeholder="Digite o CPF do guardião"
              error={errors}
              type="text"
            />
          </div>

          <Inputs
            label="Contato do guardião"
            name="guardian_contact"
            register={register}
            placeholder="Digite o contato do guardião"
            error={errors}
            type="text"
          />

          <Button type="submit" className="w-full">
            {mode === "create" ? "Criar" : "Salvar alterações"}
          </Button>

          {errorForm && <div className="text-red-500 mt-2">{errorForm}</div>}
        </form>
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

export default CadastrarPaciente;
