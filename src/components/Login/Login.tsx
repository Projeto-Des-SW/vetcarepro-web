import { Button, Image, Input, Switch } from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import banner from "../../assets/_a83c0202-0df2-4ba8-8aa9-b232f3a58d72.jpg";
import EyeClosed from "../../assets/icons/EyeClosed";
import EyeOpen from "../../assets/icons/EyeOpen";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import welcome from "../../assets/boasVindas.png";
import welcomeBack from "../../assets/bemVindoDeVolta.png";

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
    setSchema(isLogin ? loginSchema : cadastroSchema);
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
    resolver: yupResolver(schema),
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
      className="flex w-screen h-[80vh] items-center justify-center"
      animate={{ x: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      {isLogin ? (
        <>
          <motion.main
            whileHover={{ scale: 1.05 }}
            className="bg-[#4EBA9D] w-1/4 h-[57%] flex flex-col justify-between rounded-[36px] p-7 z-20"
            animate={{
              x: [
                200, 180, 170, 160, 150, 140, 130, 120, 110, 100, 80, 70, 60,
                50, 40, 30, 28, 26, 24, 22, 20, 18, 15, 13, 10, 8, 6, 4, 2, 0,
              ],
            }}
          >
            <h2>Bem-vindo</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Input
                label="Email"
                className="font-sans"
                color={isFieldError(errors, "email") ? "danger" : "default"}
                placeholder="Digite o seu email"
                {...register("email")}
              />

              <Input
                type={visibilityState ? "text" : "password"}
                label="Senha"
                placeholder="Digite sua senha"
                color={isFieldError(errors, "password") ? "danger" : "default"}
                {...register("password")}
                endContent={
                  <button
                    type="button"
                    onClick={handleVisible}
                    className="focus:outline-none"
                  >
                    {visibilityState ? (
                      <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeOpen className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />

              <Switch name="stayOn">Continuar logado</Switch>
              <Button className="bg-[#AAFAEF]" type="submit">
                Login
              </Button>
            </form>
            <Button onClick={handleChangeLogin} className="w-1/4">
              Cadastro
            </Button>
          </motion.main>

          <motion.div
            className="z-10 p-3"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: [-100, -80, -70, -50, -40, -20, -10, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              x: { duration: 1, delay: 0.2 },
            }}
          >
            <Image src={welcomeBack} alt="cadastro" width={500} />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            className="z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: [100, 80, 70, 50, 40, 20, 10, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              x: { duration: 1, delay: 0.2 },
            }}
          >
            <Image src={welcome} alt="cadastro" width={500} />
          </motion.div>

          <motion.main
            className="bg-[#4EBA9D] w-1/4  flex flex-col justify-between rounded-[36px] p-7 gap-1 z-20"
            transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
            whileHover={{ scale: 1.05 }}
            animate={{
              x: [
                -200, -180, -170, -160, -150, -140, -130, -120, -110, -100, -80,
                -70, -60, -50, -40, -30, -28, -26, -24, -22, -20, -18, -15, -13,
                -10, -8, -6, -4, -2, 0,
              ],
            }}
          >
            <h2>Bem-vindo</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <Input
                label="Nome"
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

              <Input
                label="Email"
                placeholder="Digite o seu email"
                {...register("email")}
                color={isFieldError(errors, "email") ? "danger" : "default"}
              />

              <Input
                type={visibilityState ? "text" : "password"}
                label="Senha"
                placeholder="Digite sua senha"
                {...register("password")}
                color={isFieldError(errors, "password") ? "danger" : "default"}
                endContent={
                  <button
                    type="button"
                    onClick={handleVisible}
                    className="focus:outline-none"
                  >
                    {visibilityState ? (
                      <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeOpen className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
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
            </form>
            <Button onClick={handleChangeLogin} className="w-1/4">
              Login
            </Button>
          </motion.main>
        </>
      )}
    </motion.section>
  );
};

export default Login;
