import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login/Login";
import { motion } from "framer-motion";
import Cadastro from "@/components/Cadastro/Cadastro";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import cachorroFeliz from "../../assets/cachorroFeliz.png";
import cachorroFeliz2 from "../../assets/cachorroFeliz2.png";
import { useEffect, useState } from "react";
import husky from "../../assets/hunkyTransparente.png";

const LoginArea = () => {
  const [banner, setBanner] = useState(false);
  const [bannerImage, setBannerImage] = useState(cachorroFeliz);

  useEffect(() => {
    if (banner) {
      setBannerImage(cachorroFeliz);
    } else {
      setBannerImage(cachorroFeliz2);
    }
  }, [banner]);

  console.log(banner);

  return (
    <section className="w-full h-[85vh] flex justify-center items-center">
      <Card className=" flex justify-center items-center w- h-fit">
        <CardHeader
          className="w-[600px] h-[600px] bg-[#4EBA9D]  rounded-lg p-7 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${husky})`,
          }}
        >
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-8 w-8"
            >
              <circle cx="11" cy="4" r="2"></circle>
              <circle cx="18" cy="8" r="2"></circle>
              <circle cx="20" cy="16" r="2"></circle>
              <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"></path>
            </svg>
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
