import logo from '../../assets/_a83c0202-0df2-4ba8-8aa9-b232f3a58d72.jpg'

const Recursos = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 flex flex-col justify-center items-center">
            <div className="inline-block rounded-lg bg-[#4EBA9D] px-3 py-1 text-sm">
              Recursos
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Tudo o que você precisa para gerenciar sua clínica
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed w-[70%]">
              O VETCARE oferece uma ampla gama de recursos para facilitar o
              atendimento aos seus pacientes e a administração do seu negócio,
              desde o agendamento de consultas até a emissão de relatórios
              financeiros.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Agendamento</h3>
                  <p className="text-muted-foreground">
                    Gerencie facilmente o agendamento de consultas e
                    procedimentos.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Finanças</h3>
                  <p className="text-muted-foreground">
                    Acompanhe o fluxo de caixa, emita faturas e relatórios
                    financeiros.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Estoque</h3>
                  <p className="text-muted-foreground">
                    Gerencie o estoque de medicamentos e suprimentos médicos.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <img
            src={logo}
            width="550"
            height="310"
            alt="Image"
          />
        </div>
      </div>
    </section>
  );
};

export default Recursos;
