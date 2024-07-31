import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import banner from "../../assets/bemVindoDeVolta.png";
import Login from "@/components/Login/Login";
import Cadastro from "@/components/Cadastro/Cadastro";

const LoginArea = () => {
  return (
    <section className="w-full flex justify-center items-center">
      <picture>
        <img src={banner} />
      </picture>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
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
    </section>
  );
};

export default LoginArea;
