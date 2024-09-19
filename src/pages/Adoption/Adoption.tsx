import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserSelector } from "@/store/hooks";
import { adoption } from "@/utils/animals.util";

const Adoption = () => {
  const user = useUserSelector((state) => state.user);

  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32  ${
        user.isDarkMode ? "dark bg-black" : "bg-white"
      }`}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-8">
          <div className="flex items-center justify-between">
            <h1
              className={` text-3xl font-bold ${
                user.isDarkMode && "text-white"
              }`}
            >
              Animais Disponíveis para Adoção
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {adoption.map((pet) => (
              <Card
                className={`bg-background shadow-lg ${
                  user.isDarkMode && "dark"
                }`}
              >
                <CardHeader className="flex flex-col items-start justify-between p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={pet.image.photo}
                      alt="Rabbit"
                      width={100}
                      height={100}
                      className="rounded-full"
                      style={{ aspectRatio: "100/100", objectFit: "cover" }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pet.unit.city.name} - {pet.unit.state} -{" "}
                        {pet.unit.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Genero</span>
                    <span className="text-green-500 font-medium">
                      {pet.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Raça:</span>
                    <span className="text-green-500 font-medium">
                      {pet.specie}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Adoption;
