import * as yup from "yup";

export const AgendamentoSchema = yup
  .object({
    clinic_id: yup.string(),
    patient_id: yup.string().required("Patient ID is required"),
    service_id: yup.string().required("Service ID is required"),
    date: yup.date().required("Date is required"),
    horario: yup.string().required(),
  })
  .required();

export const cadastroSchema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export const cadastroClinicaSchema = yup
  .object({
    title: yup.string().required("Nome da clínica é obrigatório"),
    description: yup.string().required("Descrição da clínica é obrigatória"),
    email: yup
      .string()
      .email("Formato de e-mail inválido")
      .required("E-mail é obrigatório"),
    phone: yup
      .string()
      .matches(/^\d{10,11}$/, "Número de telefone inválido")
      .required("Telefone é obrigatório"),
    address: yup.string().required("Endereço é obrigatório"),
    cnpj: yup
      .string()
      .matches(/^\d{14}$/, "CNPJ inválido")
      .required("CNPJ é obrigatório"),
  })
  .required();

export const serviceSchema = yup
  .object({
    clinic_id: yup.string(),
    title: yup.string().required("Pet name is required"),
    type: yup.string().required("Service type is required"),
    amount: yup.string().required("Amount is required"),
  })
  .required();

export const petSchema = yup
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
