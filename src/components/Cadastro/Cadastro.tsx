import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
interface IFormCadastro {
  // repassword: string;
  // username: string;
  name: string;
  email: string;
  password: string;
}

const cadastroSchema = yup
  .object({
    email: yup.string().required("Email é obrigatório").email("Email inválido"),
    password: yup.string().required("Senha é obrigatória"),
    // repassword: yup
    //   .string()
    //   .oneOf([yup.ref("password")], "As senhas devem corresponder")
    //   .required("Confirmação de senha é obrigatória"),
    // username: yup.string().required("Username é obrigatório"),
    name: yup.string().required("Nome é obrigatório"),
  })
  .required();

const Cadastro = () => {
  const [visibilityState, setVisibilityState] = useState(false);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IFormCadastro> = (data) => {
    fetch("https://1291-128-201-206-35.ngrok-free.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.id) {
          console.log("Form submitted successfully");
          navigate("/");
        } else {
          throw new Error("Failed to submit form");
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
      });
    navigate("/home");
    // console.log(data);
  };

  const isFieldError = (errors: FieldErrors, field: string): boolean => {
    return !!errors[field];
  };

  const handleVisible = useCallback(() => {
    setVisibilityState((prevState) => !prevState);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormCadastro>({
    resolver: yupResolver(cadastroSchema),
  });

  console.log(errors);

  return (
    <section className="flex items-center">
      <>
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Bem vindo</CardTitle>
            <CardDescription>
              Vai ser um prazer tornar sua vida melhor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.main
              // className="bg-[#4EBA9D] w-1/4  flex flex-col justify-between rounded-[36px] p-7 gap-1 z-20"
              transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
              whileHover={{ scale: 1.05 }}
              // animate={{
              //   x: [
              //     -200, -180, -170, -160, -150, -140, -130, -120, -110, -100, -80,
              //     -70, -60, -50, -40, -30, -28, -26, -24, -22, -20, -18, -15, -13,
              //     -10, -8, -6, -4, -2, 0,
              //   ],
              // }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <Label>Nome</Label>
                <Input
                  placeholder="Digite o seu nome"
                  {...register("name")}
                  color={isFieldError(errors, "name") ? "danger" : "default"}
                />

                {/* <Input
                label="Username"
                placeholder="Digite o seu username"
                {...register("username")}
                color={isFieldError(errors, "username") ? "danger" : "default"}
              /> */}
                <Label>Email</Label>
                <Input
                  placeholder="Digite o seu email"
                  {...register("email")}
                  color={isFieldError(errors, "email") ? "danger" : "default"}
                />

                <Label>Senha</Label>
                <Input
                  type={visibilityState ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("password")}
                  color={
                    isFieldError(errors, "password") ? "danger" : "default"
                  }
                  // endContent={
                  //   <button
                  //     type="button"
                  //     onClick={handleVisible}
                  //     className="focus:outline-none"
                  //   >
                  //     {visibilityState ? (
                  //       <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  //     ) : (
                  //       <EyeOpen className="text-2xl text-default-400 pointer-events-none" />
                  //     )}
                  //   </button>
                  // }
                />

                {/* <Input
                type={visibilityState ? "text" : "password"}
                label="Confirme sua Senha"
                placeholder="Digite sua senha novamente"
                {...register("repassword")}
                color={
                  isFieldError(errors, "repassword") ? "danger" : "default"
                }
              /> */}

                <Button className="bg-[#AAFAEF]" type="submit">
                  Cadastro
                </Button>

                <Separator />

                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </form>
            </motion.main>
          </CardContent>
          {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
        </Card>
      </>
    </section>
  );
};

export default Cadastro;
