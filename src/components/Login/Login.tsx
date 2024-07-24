import { Button, Image, Input, Switch } from "@nextui-org/react";
import { FormEvent, useCallback, useState } from "react";
import EyeClosed from "../../assets/icons/EyeClosed";
import EyeOpen from "../../assets/icons/EyeOpen";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import welcome from "../../assets/boasVindas.png";
import welcomeBack from "../../assets/bemVindoDeVolta.png";

const Login = () => {
  const [visibilityState, setVisibilityState] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleChangeLogin = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleVisible = useCallback(() => {
    setVisibilityState((prevState) => !prevState);
  }, []);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData);
    console.log(formDataObj);

    //TODO: Tratar o continuar logado, salvando no localstorage pra permanecer logado ao sair da pagina
    navigate("/home");
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                name="email"
                className="font-sans"
                placeholder="Digite o seu email"
              />
              <Input
                type={visibilityState ? "text" : "password"}
                label="Senha"
                name="password"
                placeholder="Digite sua senha"
                color="danger"
                //TODO: Com a hookform, aplicar estilos de erro no color
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Input label="Nome" name="nome" placeholder="Digite o seu nome" />
              <Input
                label="Username"
                name="username"
                placeholder="Digite o seu username"
              />
              <Input
                label="Email"
                name="email"
                placeholder="Digite o seu email"
              />
              <Input
                type={visibilityState ? "text" : "password"}
                label="Senha"
                name="password"
                placeholder="Digite sua senha"
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
              <Input
                type={visibilityState ? "text" : "password"}
                label="Senha"
                name="password"
                placeholder="Digite sua senha"
              />
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
