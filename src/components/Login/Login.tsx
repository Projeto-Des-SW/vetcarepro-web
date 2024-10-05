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
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/user-slice";
import { toast } from "sonner";
import { formattedDate, formattedTime } from "@/utils/const.utils";
import { persistor } from "@/store/store";
import { useUserSelector } from "@/store/hooks";

interface IFormInput {
  email?: string;
  password?: string;
}

const baseUrl = import.meta.env.VITE_URL as string;

const loginSchema = yup
  .object({
    email: yup.string().required("Email é obrigatório").email("Email inválido"),
    password: yup.string().required("Senha é obrigatória"),
  })
  .required();

const Login = () => {
  const [visibilityState, setVisibilityState] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSwitchChange = (checked: boolean) => {
    setSwitchState(checked); 
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    const myEmail = data.email;
    fetch(`${baseUrl}/sessions`, {
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
      .then((data) => {
        console.log(data);
        if (data && data.token) {
          if (!switchState) {
            persistor.pause(); 
            persistor.purge(); 
          }
          dispatch(
            setCurrentUser({
              email: myEmail,
              token: data.token,
              notifications: [],
              isDarkMode: user.isDarkMode,
              tier: 'free',
              rememberMe: switchState,
              cart: [],
            })
          );

          navigate("/assinatura");
        } else {
          console.log(data);
          throw new Error("Failed to submit form");
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
      });

    // console.log(data);
  };

  return (
    <motion.section
      className={`flex items-center justify-center ${user.isDarkMode && 'dark'}`}
      animate={{ x: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <Card className={`w-full border-none ${user.isDarkMode && 'dark'}`}>
        <CardHeader>
          <CardTitle>Bem vindo de volta</CardTitle>
          <CardDescription>
            É um prazer ter você de volta conosco
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <motion.main whileHover={{ scale: 1.05 }}>
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
                <Switch
                  name="stayOn"
                  checked={switchState} 
                  onCheckedChange={handleSwitchChange}
                />
                <Label>Continuar logado</Label>
              </div>

              <Button className="bg-[#4EBA9D]" type="submit">
                Login
              </Button>
            </form>
          </motion.main>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default Login;
