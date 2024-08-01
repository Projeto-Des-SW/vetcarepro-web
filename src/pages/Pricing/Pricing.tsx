import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-[80vh] bg-white">
      <main className="flex-1 justify-center items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Escolha o plano ideal para sua clínica
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  O VETCARE oferece planos flexíveis para atender às
                  necessidades de clínicas de todos os tamanhos.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Plano Básico</CardTitle>
                  <CardDescription>
                    Ideal para clínicas menores com até 5 funcionários.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Agendamento de consultas</li>
                    <li>Controle de estoque</li>
                    <li>Emissão de relatórios básicos</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button>Assinar</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plano Avançado</CardTitle>
                  <CardDescription>
                    Ideal para clínicas médias com até 15 funcionários.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Tudo do plano básico</li>
                    <li>Controle financeiro avançado</li>
                    <li>Integração com sistemas externos</li>
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
        </section>
      </main>
    </div>
  );
};

export default Pricing;
