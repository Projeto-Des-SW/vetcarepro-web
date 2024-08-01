import { Button } from "../ui/button";
import { useState } from "react";

import EyeClosed from "../../assets/icons/EyeClosed";
import EyeOpen from "../../assets/icons/EyeOpen";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "../ui/switch";
import Inputs from "../Inputs/Inputs";
import { Label } from "../ui/label";

interface IFormInput {
  email: string;
  password: string;
}
const loginSchema = yup
  .object({
    email: yup.string().required("Email é obrigatório").email("Email inválido"),
    password: yup.string().required("Senha é obrigatória"),
  })
  .required();

const Login = () => {
  const [visibilityState, setVisibilityState] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  console.log(errors);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
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
      className="flex items-center justify-center"
      animate={{ x: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <Card className="w-full border-none">
        <CardHeader>
          <CardTitle>Bem vindo de volta</CardTitle>
          <CardDescription>
            É um prazer ter você de volta conosco
          </CardDescription>
        </CardHeader>
        <CardContent className="">
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
              <Inputs
                label="Email"
                name="email"
                placeholder="Digite seu email"
                register={register}
                error={errors}
              />

              <Inputs
                label="Senha"
                name="password"
                register={register}
                placeholder="Digite sua senha"
                error={errors}
                type={visibilityState ? "text" : "password"}
                icon={
                  visibilityState ? (
                    <EyeClosed
                      onClick={() =>
                        setVisibilityState((prevState) => !prevState)
                      }
                    />
                  ) : (
                    <EyeOpen
                      onClick={() =>
                        setVisibilityState((prevState) => !prevState)
                      }
                    />
                  )
                }
              />
              <div className="flex items-center gap-2">
                <Switch name="stayOn" />
                <Label>Continuar logado</Label>
              </div>

              <Button className="bg-[#4EBA9D]" type="submit">
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
