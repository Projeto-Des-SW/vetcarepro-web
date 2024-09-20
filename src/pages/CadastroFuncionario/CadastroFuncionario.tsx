import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import {
  capitalizeFirstLetter,
  formattedDate,
  formattedTime,
} from "@/utils/const.utils";
import { IFuncionario } from "@/interfaces/funcionario";
import { UserRoundPlus } from "lucide-react";
import { cadastroFuncionarioSchema } from "@/utils/schemas.utils";
import { ICrudClinia } from "@/interfaces/agendamento";

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
    resolver: yupResolver(cadastroFuncionarioSchema),
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

    const myData = {
      ...data,
      last_payment_date: "",
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
      data: myData,
    })
      .then((response) => {
        const successMessage = `Clinica - ${response.statusText}`;
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;

        toast(`${capitalizeFirstLetter(mode)} realizado com sucesso`, {
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
    <div className="h-fit">
      <Card
        className={`${
          user.isDarkMode ? "dark" : "bg-white/90"
        } flex p-8 w-fit  backdrop-blur-sm rounded-2xl shadow-2xl h-fit items-center gap-4`}
      >
        {" "}
        <form
          onSubmit={handleSubmit(handleSubmitClinica)}
          className="flex flex-col w-[500px] gap-4"
        >
          <header className="text-center m-4">
            <div className="inline-block bg-primary rounded-full p-4 mb-6 shadow-lg">
              <UserRoundPlus className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {mode === "create" ? "Cadastro" : "Edição"} de Funcionario
            </h1>
            <p className="text-gray-600">
              {mode === "create"
                ? "Cadastre um novo funcionario para sua clínica"
                : "Edite as informações do funcionario"}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Senha"
              name="password"
              placeholder="Digite a senha do funcionario"
              register={register}
              error={errors}
            />
            <Inputs
              label="Cargo"
              name="position"
              placeholder="Digite o cargo do funcionario"
              register={register}
              error={errors}
            />
          </div>

          <Inputs
            label="Salario"
            name="salary"
            placeholder="Digite o salario do funcionario"
            register={register}
            error={errors}
          />

          <Button type="submit">
            {mode === "create" ? "Criar" : "Salvar alterações"}
          </Button>

          {errorForm && <div className="text-red-500">{errorForm}</div>}
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

export default CadastroFuncionario;
