import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import axios from "axios";
import dogHappy from "../../assets/dogHappy.png";
import dogPuto from "../../assets/dogPuto.png";
import dogTriste from "../../assets/dogTriste.png";
import { Card } from "@/components/ui/card";
import {
  capitalizeFirstLetter,
  formattedDate,
  formattedTime,
} from "@/utils/const.utils";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";

import { Hospital } from "lucide-react";
import { productSchema } from "../../utils/schemas.utils";
import { ICrudClinia } from "../../interfaces/agendamento";
import { IProductPost } from "@/interfaces/product";
import Inputs from "../Inputs/Inputs";

const CadastrarProduto = ({ mode = "create", id }: ICrudClinia) => {
  const { idClinica } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IProductPost>({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    if (mode === "edit") {
      axios
        .get(`${baseUrl}/clinics/${idClinica}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          const serviceData = response.data;
          reset(serviceData);
          setValue("type", serviceData.type);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do serviço:", error);
        });
    }
  }, [mode, reset, user.token, baseUrl, setValue, idClinica, id]);

  const errorCount = Object.keys(errors).length;

  const handleSubmitProduct: SubmitHandler<IProductPost> = (data) => {
    const url =
      mode === "create"
        ? `${baseUrl}/clinics/${idClinica}/products`
        : `${baseUrl}/clinics/${idClinica}/products/${id}`;

    const method = mode === "create" ? "POST" : "PUT";

    const requestData = {
      ...data,
      clinic_id: idClinica,
      quantity: parseInt(data.quantity),
    };

    console.log(requestData);

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
        const successMessage = `Produto - ${response.statusText}`;
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;

        toast(`${capitalizeFirstLetter(mode)} realizado com sucesso`, {
          description: successDescription,
        });

        notify(successMessage, successDescription);
      })
      .catch((error) => {
        const errorMessage = "Erro ao cadastrar produto";
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
    <div className="h-fit w-fit">
      <Card
        className={`${
          user.isDarkMode ? "dark" : "bg-white/90"
        } flex p-8 w-fit  h-fit items-center gap-4`}
      >
        {" "}
        <form
          onSubmit={handleSubmit(handleSubmitProduct)}
          className="flex flex-col w-[500px] gap-4"
        >
          <header className="text-center m-4">
            <div className="inline-block bg-primary rounded-full p-4 mb-6 shadow-lg">
              <Hospital className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {mode === "create" ? "Cadastro" : "Edição"} de Produto
            </h1>
            <p className="text-gray-600">
              {mode === "create"
                ? "Cadastre um novo produto para sua clínica"
                : "Edite as informações do produto"}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label="Nome do produto"
              name="title"
              placeholder="Digite o nome do produto"
              register={register}
              error={errors}
              className="w-full"
            />

            <Inputs
              label="Quantidade"
              name="quantity"
              type="number"
              step={1}
              placeholder="Digite a quantidade"
              register={register}
              error={errors}
            />
          </div>

          <Inputs
            label="Valor"
            name="amount"
            type="number"
            step={0.01}
            placeholder="Digite o valor do produto"
            register={register}
            error={errors}
          />

          <Button type="submit" className="w-full mt-4">
            {mode === "create" ? "Criar" : "Salvar alterações"}
          </Button>

          {errorForm && (
            <div className="text-red-500 text-center">{errorForm}</div>
          )}
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

export default CadastrarProduto;
