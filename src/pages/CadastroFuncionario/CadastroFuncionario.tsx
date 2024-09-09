import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import Inputs from "@/components/Inputs/Inputs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
import { useUserSelector } from "@/store/hooks";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { IFuncionario } from "@/interfaces/funcionario";

interface ICrudClinia {
  mode?: "create" | "edit";
}

const cadastroSchema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const CadastroFuncionario = ({ mode = "create" }: ICrudClinia) => {
  const { idClinica, id } = useParams();
  const dispatch = useDispatch();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFuncionario>({
    resolver: yupResolver(cadastroSchema),
  });

  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`${baseUrl}/clinics/${idClinica}/employees/${id}`, {
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

  const handleSubmitClinica: SubmitHandler<IFuncionario> = (data) => {
    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/employees`
        : `${baseUrl}/clinics/${idClinica}/employees/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

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
      data,
    })
      .then((response) => {
        const successMessage = `Clinica - ${response.statusText}`;
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;

        toast(`${mode} realizado com sucesso`, {
          description: successDescription,
        });

        notify(successMessage, successDescription);
      })
      .catch((error) => {
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
        console.log(data);
      });
  };

  return (
    <Card className="flex p-8 w-fit h-fit items-center gap-4">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col w-[500px] gap-4"
      >
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {mode === "create" ? "Cadastre" : "Edite"} seu funcionario
        </h2>

        <div className="flex gap-4">
          <Inputs
            label="Nome do funcionario"
            name="name"
            placeholder="Digite o nome do funcionario"
            register={register}
            error={errors}
          />
          <Inputs
            label="Email do funcionario"
            name="email"
            placeholder="Digite o email do funcionario"
            register={register}
            error={errors}
          />
        </div>

        <div className="flex gap-4">
          <Inputs
            label="Senha"
            name="password"
            placeholder="Digite a senha do funcionario"
            register={register}
            error={errors}
          />
        </div>

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

export default CadastroFuncionario;
