import { Button, Image, Input } from "@nextui-org/react";
import banner from "../../assets/_a83c0202-0df2-4ba8-8aa9-b232f3a58d72.jpg";
import { Link } from "react-router-dom";
import { FormEvent } from "react";

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const myData = new FormData(e.currentTarget);
  const myDataForm = Object.fromEntries(myData);
  console.log(myDataForm);
};

const Cadastro = () => {
  return (
    <section className="flex w-[100vw] h-[100vh] items-center justify-center">
      <Image src={banner} alt="cadastro" isZoomed width={600} />

      <main className="bg-[#4EBA9D] w-[30%] h-[50%] flex flex-col justify-between rounded-lg p-7">
        <h2>Bem vindo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" name="email" placeholder="Digite o seu email" />

          <Button className="bg-[#AAFAEF]" type="submit">
            Login
          </Button>
        </form>

        <Link to="/login">Login</Link>
      </main>
    </section>
  );
};

export default Cadastro;
