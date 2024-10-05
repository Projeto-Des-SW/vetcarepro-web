import Assinatura from "../Assinatura/Assinatura";

const Pricing = () => {
  return (
    <div className="flex flex-col overflow-y-auto h-screen gap-2 items-center p-4 my-4">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-white">
        Escolha o plano ideal para sua clínica
      </h2>
      <p className="max-w-[900px] text-muted-foreground">
        O VETCARE oferece planos flexíveis para atender às necessidades de
        clínicas de todos os tamanhos.
      </p>

      <Assinatura mode={false} />
    </div>
  );
};

export default Pricing;
