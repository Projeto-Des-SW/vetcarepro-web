import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <section className="flex gap-4 h-[94vh]">
      <nav className="bg-[#E4E4E7] w-[15%] h-full box-border">
        <p>Home</p>
        <p>Home</p>
        <p>Home</p>
        <p>Home</p>
      </nav>

      <aside className="flex flex-col justify-center items-center w-full p-8">
        <div className="flex flex-col justify-center gap-2">
          <div className="flex justify-between">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Suas clinicas veterinárias
            </h2>
            <Button>Adicionar clinica</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Plano Enterprise</CardTitle>
                <CardDescription>
                  Ideal para clínicas grandes com mais de 15 funcionários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Tudo dos planos anteriores</li>
                  <li>Suporte prioritário</li>
                  <li>Personalização avançada</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button>Assinar</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plano Enterprise</CardTitle>
                <CardDescription>
                  Ideal para clínicas grandes com mais de 15 funcionários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Tudo dos planos anteriores</li>
                  <li>Suporte prioritário</li>
                  <li>Personalização avançada</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button>Assinar</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plano Enterprise</CardTitle>
                <CardDescription>
                  Ideal para clínicas grandes com mais de 15 funcionários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Tudo dos planos anteriores</li>
                  <li>Suporte prioritário</li>
                  <li>Personalização avançada</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button>Assinar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Dashboard;
