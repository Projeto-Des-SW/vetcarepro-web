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

interface IFromClinica {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  cnpj: string;
}

interface ICrudClinia {
  mode?: "create" | "edit";
}

const cadastroSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string().required(),
    address: yup.string().required(),
    cnpj: yup.string().required(),
  })
  .required();

const CadastroClinica = ({ mode = "create" }: ICrudClinia) => {
  const { id } = useParams();
  const user = useUserSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_URL as string;
  const [errorForm, setErrorForm] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFromClinica>({
    resolver: yupResolver(cadastroSchema),
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
          reset(clinicaData); // Preenche o formulário com os dados da clínica
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

    axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      data,
    })
      .then(() => {
        toast("Cadastro realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrorForm(error.response.data.message); 
        } else {
          setErrorForm("Ocorreu um erro inesperado. Por favor, tente novamente."); 
        }
        console.log(data)
      });
  };

  return (
    <Card className="flex p-8 w-fit items-center gap-4">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col w-[500px] gap-4"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} sua clínica</h1>

        <div className="flex gap-4">
          <Inputs
            label="Nome da clínica"
            name="title"
            placeholder="Digite o nome da clínica"
            register={register}
            error={errors}
          />
          <Inputs
            label="Descrição da clínica"
            name="description"
            placeholder="Digite a descrição da clínica"
            register={register}
            error={errors}
          />
        </div>

        <div className="flex gap-4">
          <Inputs
            label="Email da clínica"
            name="email"
            placeholder="Digite o email da clínica"
            register={register}
            error={errors}
          />
          <Inputs
            label="Telefone da clínica"
            name="phone"
            placeholder="Digite o telefone da clínica"
            register={register}
            error={errors}
          />
        </div>

        <div className="flex gap-4">
          <Inputs
            label="CNPJ"
            name="cnpj"
            placeholder="Digite o CNPJ da clínica"
            register={register}
            error={errors}
          />
          <Inputs
            label="Endereço"
            name="address"
            placeholder="Digite o endereço da clínica"
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

export default CadastroClinica;
