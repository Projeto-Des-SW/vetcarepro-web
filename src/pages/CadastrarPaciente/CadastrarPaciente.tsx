import React, { useEffect, useState } from "react";
import Inputs from "@/components/Inputs/Inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import boasVindas from "../../assets/boasVindas.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IPet } from "@/interfaces/paciente";
import { ICrud } from "@/interfaces/clinicas";
import { useParams } from "react-router-dom";

const petSchema = yup
  .object({
    clinic_id: yup.string().required("Clinic ID is required"),
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
  const [clinics, setClinics] = useState<{ id: string; title: string }[]>([]);
  const {id} = useParams()

  useEffect(() => {
    // Fetch the clinics from the API
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => setClinics(data))
      .catch((error) => console.error("Error fetching clinics:", error));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPet>({
    resolver: yupResolver(petSchema),
  });

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  const handleSubmitClinica: SubmitHandler<IPet> = (data) => {
    console.log(data)
    const url =
      mode === "create"
        ? "https://df23-2804-214-822c-257b-dd83-41b4-246c-d0b/users"
        : "https://df23-2804-214-822c-257b-dd83-41b4-246c-d0b/users";

    const method = mode === "create" ? "POST" : "PUT";

    fetch(url, {
      method,
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
  };

  console.log(errors)

  return (
    <section className="flex p-8 w-full justify-evenly">
      <form
        onSubmit={handleSubmit(handleSubmitClinica)}
        className="flex flex-col w-[500px] gap-4"
      >
        <h1>{mode === "create" ? "Cadastre" : "Edite"} o paciente</h1>

        <Inputs
          label="Nome do pet"
          name="name"
          placeholder="Digite o nome do pet"
          register={register}
          error={errors}
          className="w-full"
        />
        <Inputs
          label="Digite a especie"
          name="species"
          placeholder="Digite a especie"
          register={register}
          error={errors}
        />
        <Inputs
          label="Digite a idade"
          name="age"
          type="number"
          placeholder="Digite a idade"
          register={register}
          error={errors}
        />
        <Inputs
          label="Digite o tipo sanguineo"
          name="breed"
          placeholder="Digite o tipo sanguineo"
          register={register}
          error={errors}
        />
        <Inputs
          label="Digite o nome do guardião"
          name="guardian_name"
          register={register}
          placeholder="Digite o nome do guardião"
          error={errors}
          type="text"
        />
        <Inputs
          label="Digite o CPF do guardião"
          name="guardian_cpf"
          register={register}
          placeholder="Digite o CPF do guardião"
          error={errors}
          type="text"
        />

        <Inputs
          label="Digite o contato do guardião"
          name="guardian_contact"
          register={register}
          placeholder="Digite o contato do guardião"
          error={errors}
          type="text"
        />

        <select
          {...register("clinic_id")}
          className={`w-full p-2 border ${
            errors.clinic_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Selecione a clínica</option>
          {clinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.title}
            </option>
          ))}
        </select>
        {errors.clinic_id && (
          <span className="text-red-500">{errors.clinic_id.message}</span>
        )}

        <Button>Criar</Button>
      </form>
      <picture className="flex h-auto items-center">
        <img src={boasVindas} alt="" />
      </picture>
    </section>
  );
};

export default CadastrarPaciente;
