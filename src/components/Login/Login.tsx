import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState, useEffect, useCallback } from "react";

import EyeClosed from "../../assets/icons/EyeClosed";
import EyeOpen from "../../assets/icons/EyeOpen";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "../ui/switch";

interface IFormInput {
  email: string;
  password: string;
}

interface IFormCadastro extends IFormInput {
  // repassword: string;
  // username: string;
  name: string;
}

const loginSchema = yup
  .object({
    email: yup.string().required("Email é obrigatório").email("Email inválido"),
    password: yup.string().required("Senha é obrigatória"),
  })
  .required();

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

const isFieldError = (errors: FieldErrors, field: string): boolean => {
  return !!errors[field];
};

const Login = () => {
  const [visibilityState, setVisibilityState] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [schema, setSchema] = useState(loginSchema);

  const handleChangeLogin = () => {
    setIsLogin((prevState) => !prevState);
  };

  useEffect(() => {
    setSchema(loginSchema);
    reset(); // Reset the form whenever schema changes
  }, [isLogin]);

  const handleVisible = useCallback(() => {
    setVisibilityState((prevState) => !prevState);
  }, []);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput | IFormCadastro>({
    resolver: yupResolver(loginSchema),
  });

  console.log(errors);

  const onSubmit: SubmitHandler<IFormInput | IFormCadastro> = (data) => {
    fetch("https://1291-128-201-206-35.ngrok-free.app/sessions", {
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

  return (
    <motion.section
      className="flex items-center "
      animate={{ x: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Bem vindo de volta</CardTitle>
          <CardDescription>É um prazer ter você de volta conosco</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.main
            whileHover={{ scale: 1.05 }}
            // className="bg-[#4EBA9D]  flex flex-col justify-between rounded-[36px] p-7 z-20"
            // animate={{
            //   x: [
            //     200, 180, 170, 160, 150, 140, 130, 120, 110, 100, 80, 70, 60,
            //     50, 40, 30, 28, 26, 24, 22, 20, 18, 15, 13, 10, 8, 6, 4, 2, 0,
            //   ],
            // }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Label>Email</Label>
              <Input
                className="font-sans"
                color={isFieldError(errors, "email") ? "danger" : "default"}
                placeholder="Digite o seu email"
                {...register("email")}
              />

              <Label>Senha</Label>
              <Input
                type={visibilityState ? "text" : "password"}
                placeholder="Digite sua senha"
                color={isFieldError(errors, "password") ? "danger" : "default"}
                {...register("password")}
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

              <Switch name="stayOn" />
              <Button className="bg-[#AAFAEF]" type="submit">
                Login
              </Button>
            </form>
          </motion.main>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </motion.section>
  );
};

export default Login;
