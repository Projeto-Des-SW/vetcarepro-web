import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import EyeClosed from "../../assets/icons/EyeClosed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import Inputs from "../Inputs/Inputs";
import EyeOpen from "@/assets/icons/EyeOpen";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dog from "../../assets/okDog.png";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/user-slice";
interface IFormCadastro {
  // repassword: string;
  // username: string;
  name: string;
  email: string;
  password: string;
}
const baseUrl = import.meta.env.VITE_URL as string;
const cadastroSchema = yup
  .object({
    email: yup.string().required("Email é obrigatório").email("Email inválido"),
    password: yup.string().required("Senha é obrigatória").min(6),
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
  const [openSucessCadastro, setOpenSucessCadastro] = useState(false);
  const dispatch = useDispatch();
  const [errorForm, setErrorForm] = useState("");

  const onSubmit: SubmitHandler<IFormCadastro> = (data) => {
  
    fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        const successDescription = `Data: ${formattedDate}, Hora: ${formattedTime}`;
        let title = "Cadastrado com sucesso!";
        if (response.status === 200 || response.status === 201) {
          title = "Cadastrado com sucesso!";
        } else {
          title = "Ocorreu um erro, tente mais tarde!";
        }

        toast(`${title}`, {
          description: successDescription,
        });

        return response.json();
      })

      .catch((error) => {
        console.error("Form submission error:", error);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormCadastro>({
    resolver: yupResolver(cadastroSchema),
  });

  // console.log(errors);

  return (
    <section className="flex items-center">
      <>
        <Dialog
          open={openSucessCadastro}
          onOpenChange={() => setOpenSucessCadastro(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sucesso!</DialogTitle>
              <DialogDescription>
                O seu cadastro foi realizado com sucesso! Aproveite!
                <img src={dog} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Card className="w-full border-none">
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
                <Inputs
                  label="Nome"
                  name="name"
                  register={register}
                  placeholder="Digite o seu nome"
                  error={errors}
                />
                {/* <Input
                label="Username"
                placeholder="Digite o seu username"
                {...register("username")}
                color={isFieldError(errors, "username") ? "danger" : "default"}
              /> */}

                <Inputs
                  label="Email"
                  name="email"
                  placeholder="Digite seu melhor email"
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
                {/* <Label>Senha</Label>
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
                /> */}

                {/* <Input
                type={visibilityState ? "text" : "password"}
                label="Confirme sua Senha"
                placeholder="Digite sua senha novamente"
                {...register("repassword")}
                color={
                  isFieldError(errors, "repassword") ? "danger" : "default"
                }
              /> */}

                <Button className="bg-[#4EBA9D]" type="submit">
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
