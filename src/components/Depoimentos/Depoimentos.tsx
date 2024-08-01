import depoimentos from "../../assets/depoimentos.png";

const Depoimentos = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Depoimentos
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              O que nossos clientes dizem
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Veja o que os veterinários e donos de clínicas que usam o VETCARE
              têm a dizer sobre a nossa solução.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid gap-4">
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-muted-foreground">
                  "O VETCARE simplificou muito a gestão da minha clínica.
                  Agora tenho mais tempo para me dedicar ao atendimento
                  dos meus pacientes."
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <p className="font-medium">Dr. Rodrigo Silva</p>
                    <p className="text-muted-foreground text-sm">
                      Veterinário, Clínica Vet Center
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-muted-foreground">
                  "Desde que adotamos o VETCARE, nossa clínica se tornou muito
                  mais organizada e eficiente. Recomendo a qualquer
                  veterinário!"
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <p className="font-medium">Dra. Juliana Costa</p>
                    <p className="text-muted-foreground text-sm">
                      Veterinária, Clínica Vet Life
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            src={depoimentos}
            width="550"
            height="310"
            alt="Image"
            // className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Depoimentos;
