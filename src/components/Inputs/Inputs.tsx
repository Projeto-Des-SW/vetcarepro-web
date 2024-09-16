import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface InputsProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error: FieldErrors | undefined;
  icon?: ReactNode;
}

const Inputs = ({
  label,
  name,
  register,
  error,
  icon,
  ...props
}: InputsProps) => {
  const errorMessage = error?.[name]?.message as string | undefined;

  return (
    <div className="relative w-full">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          {...props}
          {...register(name)}
          className={`pr-10 ${
            errorMessage ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {icon}
          </div>
        )}
      </div>
      {errorMessage && <Label className="text-red-600">{errorMessage}</Label>}
    </div>
  );
};

export default Inputs;
