import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import Inputs from "@/components/Inputs/Inputs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserSelector } from "@/store/hooks";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { Hospital } from "lucide-react"; 
import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
import { cadastroClinicaSchema } from "@/utils/schemas.utils";
import { ICrudClinia, IFromClinica } from "@/interfaces/agendamento";

const CadastroClinica = ({ mode = "create" }: ICrudClinia) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFromClinica>({
    resolver: yupResolver(cadastroClinicaSchema),
  });

  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`${baseUrl}/clinics/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          const clinicaData = response.data;
          reset(clinicaData);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da clínica:", error);
        });
    }
  }, [mode, id, reset, user.token, baseUrl]);

  const handleSubmitClinica: SubmitHandler<IFromClinica> = (data) => {
    const url =
      mode === "create" ? `${baseUrl}/clinics` : `${baseUrl}/clinics/${id}`;
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
        const successMessage = `Clínica - ${response.statusText}`;
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
              <Hospital className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {mode === "create" ? "Cadastro" : "Edição"} de Clínica
            </h1>
            <p className="text-gray-600">
              Gerencie as informações da sua clínica
            </p>
          </header>
          {/* <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
            {mode === "create" ? (
              <Hospital className="w-6 h-6 mr-2 text-red-500" />
            ) : (
              <Edit3 className="w-6 h-6 mr-2 text-red-500" />
            )}
            {mode === "create" ? "Cadastre" : "Edite"} sua clínica
          </h2> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Nome da clínica"
              name="title"
              placeholder="Digite o nome da clínica"
              register={register}
              error={errors}
              className="w-full"
            />
            <Inputs
              label="Descrição da clínica"
              name="description"
              placeholder="Digite a descrição"
              register={register}
              error={errors}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="E-mail"
              name="email"
              type="email"
              placeholder="Digite o e-mail da clínica"
              register={register}
              error={errors}
            />
            <Inputs
              label="Telefone"
              name="phone"
              placeholder="Digite o telefone"
              register={register}
              error={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="CNPJ"
              name="cnpj"
              placeholder="Digite o CNPJ da clínica"
              register={register}
              error={errors}
              type="text"
            />
            <Inputs
              label="Endereço"
              name="address"
              placeholder="Digite o endereço da clínica"
              register={register}
              error={errors}
              type="text"
            />
          </div>

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

export default CadastroClinica;
