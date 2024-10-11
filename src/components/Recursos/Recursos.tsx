const Recursos = () => {
  return (
    <section className="w-full md:py-24 py-24 bg-muted">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 flex flex-col justify-center items-center">
            <div className="inline-block rounded-lg bg-white px-3 py-1 text-sm">
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
        <div className="flex w-full p-8">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid grid-cols-3 gap-6 w-full">
              <li>
                <div className="">
                  <h3 className="text-xl font-bold">Agendamento</h3>
                  <p className="text-muted-foreground">
                    Gerencie facilmente o agendamento de consultas e
                    procedimentos.
                  </p>
                </div>
              </li>
              <li>
                <div className="">
                  <h3 className="text-xl font-bold">Finanças</h3>
                  <p className="text-muted-foreground">
                    Acompanhe o fluxo de caixa, emita faturas e relatórios
                    financeiros.
                  </p>
                </div>
              </li>
              <li>
                <div className="">
                  <h3 className="text-xl font-bold">Estoque</h3>
                  <p className="text-muted-foreground">
                    Gerencie o estoque de medicamentos e suprimentos médicos.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recursos;
