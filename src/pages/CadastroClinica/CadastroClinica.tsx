import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import Inputs from "@/components/Inputs/Inputs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import boasVindas from "../../assets/boasVindas.png";
import { useUserSelector } from "@/store/hooks";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Usado para resetar os valores do formulário
  } = useForm<IFromClinica>({
    resolver: yupResolver(cadastroSchema),
  });

  // Função para buscar os dados da clínica e preencher o formulário
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
      .then((response) => {
        toast("Cadastro realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao enviar o formulário:", error);
      });
  };

  return (
    <section className="flex p-8 w-full justify-evenly">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col w-[500px] gap-4"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} sua clínica</h1>

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

        <Button type="submit">
          {mode === "create" ? "Criar" : "Salvar alterações"}
        </Button>
      </form>
      <picture className="flex h-auto items-center">
        <img src={boasVindas} alt="Imagem de boas-vindas" />
      </picture>
    </section>
  );
};

export default CadastroClinica;
