import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login/Login";
import { motion } from "framer-motion";
import Cadastro from "@/components/Cadastro/Cadastro";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import husky from "../../assets/hunkyTransparente.png";
import { useUserSelector } from "@/store/hooks";
import { PawPrintIcon } from "lucide-react";

const LoginArea = () => {
  const user = useUserSelector((state) => state.user);
  return (
    <section
      className={`w-full h-[85vh] flex justify-center items-center ${
        user.isDarkMode && "dark"
      }`}
    >
      <Card className=" flex justify-center items-center w- h-fit">
        <CardHeader
          className="w-[600px] h-[600px] bg-[#4EBA9D]  rounded-lg p-7 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${husky})`,
          }}
        >
          <div className="flex items-center gap-4">
            <PawPrintIcon size="35"/>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
              VetCarePro
            </h1>
          </div>

          <motion.p
            className="text-md text-muted-foreground text-white bg-opacity-50 bg-black p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            O VETCARE é um sistema completo de gestão de clínicas veterinárias,
            com recursos avançados para facilitar o atendimento aos seus
            pacientes e a administração do seu negócio.
          </motion.p>
        </CardHeader>
        <CardContent className="flex items-center w-[600px] justify-center ">
          <Tabs defaultValue="login" className="w-[500px] flex flex-col ">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="cadastro">
              <Cadastro />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginArea;
