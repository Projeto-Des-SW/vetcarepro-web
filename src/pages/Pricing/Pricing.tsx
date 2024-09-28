import Assinatura from "../Assinatura/Assinatura";

const Pricing = () => {
  return (
    <div className="flex flex-col overflow-y-auto bg-white h-screen ">
      <main className="flex-1 justify-center items-center ">
        <section className="w-full py-10 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-white">
                  Escolha o plano ideal para sua clínica
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  O VETCARE oferece planos flexíveis para atender às
                  necessidades de clínicas de todos os tamanhos.
                </p>
              </div>
            </div>
            <Assinatura mode={false} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
