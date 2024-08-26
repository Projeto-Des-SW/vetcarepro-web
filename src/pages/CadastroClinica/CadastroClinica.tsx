import Inputs from "@/components/Inputs/Inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import boasVindas from "../../assets/boasVindas.png";
import { Button } from "@/components/ui/button";
interface IFromClinica {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}
import { toast } from "sonner";
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
  })
  .required();

const CadastroClinica = ({ mode = "create" }: ICrudClinia) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFromClinica>({
    resolver: yupResolver(cadastroSchema),
  });

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  const handleSubmitClinica: SubmitHandler<IFromClinica> = (data) => {
    if (mode === "create") {
      console.log("criando");
      fetch("https://df23-2804-214-822c-257b-dd83-41b4-246c-d0b/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data) {
            console.log("Form submitted successfully");
            toast("Cadastro realizado com sucesso", {
              description: `Data: ${formattedDate}, Hora: ${formattedTime}`,
              action: {
                label: "Dispensar",
                onClick: () => console.log("Undo"),
              },
            });
          } else {
            throw new Error("Failed to submit form");
          }
        })
        .catch((error) => {
          console.error("Form submission error:", error);
        });
    } else {
      console.log("edit");
      fetch("https://df23-2804-214-822c-257b-dd83-41b4-246c-d0b/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data) {
            console.log("Form submitted successfully");
            toast("Cadastro realizado com sucesso", {
              description: `Data: ${formattedDate}, Hora: ${formattedTime}`,
              action: {
                label: "Dispensar",
                onClick: () => console.log("Undo"),
              },
            });
          } else {
            throw new Error("Failed to submit form");
          }
        })
        .catch((error) => {
          console.error("Form submission error:", error);
        });
    }
    console.log(data);
  };

  return (
    <section className="flex p-8 w-full justify-evenly">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col w-[500px] gap-4"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} sua clinica</h1>

        <Inputs
          label="Nome da clinica"
          name="title"
          placeholder="Digite seu melhor email"
          register={register}
          error={errors}
          className="w-full"
        />
        <Inputs
          label="Descrição da clinica"
          name="description"
          placeholder="Digite seu melhor email"
          register={register}
          error={errors}
        />
        <Inputs
          label="Digite um email para a clinica"
          name="email"
          placeholder="Digite seu melhor email"
          register={register}
          error={errors}
        />
        <Inputs
          label="Telefone de contato"
          name="phone"
          placeholder="Digite seu melhor email"
          register={register}
          error={errors}
        />
        <Inputs
          label="Endereço"
          name="address"
          register={register}
          placeholder="Digite sua senha"
          error={errors}
          type="text"
        />

        <Button>Criar</Button>
      </form>
      <picture className="flex h-auto items-center">
        <img src={boasVindas} alt="" />
      </picture>
    </section>
  );
};

export default CadastroClinica;
