import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ComponentPropsWithoutRef } from "react";

interface InputsProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error: FieldErrors | undefined;
}

const Inputs = ({ label, name, register, error, ...props }: InputsProps) => {
  const errorMessage = error?.[name]?.message as string | undefined;
  return (
    <>
      <Label>{label}</Label>
      <Input
        {...props}
        placeholder="Digite o seu nome"
        {...register(name)}
        className={`${error?.[name] && "border-red-500 focus:ring-red-500"}`}
      />
      {error?.[name] && <Label className="text-red-600">{errorMessage}</Label>}
    </>
  );
};

export default Inputs;
