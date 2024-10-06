import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Team = () => {
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const team = [
    {
      name: "Pedro Caitano",
      stack: "Front-end",
      image: "https://avatars.githubusercontent.com/u/83237899?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/pedro-souza-385794241/",
        github: "github.com/iShouldz",
      },
    },
    {
      name: "Weverton Cintra",
      stack: "Back-end",
      image: "https://avatars.githubusercontent.com/u/33919003?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/wevertoncintra/",
        github: "https://github.com/WevertonCintra",
      },
    },
    {
      name: "Lucas Romeiro",
      stack: "Back-end",
      image: "https://avatars.githubusercontent.com/u/82480682?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/pedro-souza-385794241/",
        github: "https://github.com/lucas-romeiro",
      },
    },
    {
      name: "Romário Abílio",
      stack: "Analista de dados",
      image: "https://avatars.githubusercontent.com/u/113223503?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/romário-abílio-837505235/",
        github: "https://github.com/romarioabilio",
      },
    },
    {
      name: "Luiz Fellipe",
      stack: "QA",
      image: "https://avatars.githubusercontent.com/u/78767627?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/pedro-souza-385794241/",
        github: "https://github.com/Luizfdarb",
      },
    },
  ];

  return (
    <main className="overflow-y-auto h-screen">
      <section className="flex flex-col justify-center items-center gap-8 px-4 py-10 ">
        <h1 className="text-2xl font-bold dark:text-white">
          Conheça nosso time
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 w-full max-w-[90%] mb-12">
          {team.map((participant, index) => (
            <Card
              key={index}
              className="bg-background shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <CardHeader className="p-0">
                <img
                  src={participant.image}
                  alt={`participant-img-${participant.name}`}
                  className="w-full h-56 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <h1 className="text-lg font-semibold">{participant.name}</h1>
                <h2 className="text-sm text-muted-foreground">
                  Stack: {participant.stack}
                </h2>
              </CardContent>
              <CardFooter className="flex gap-2 p-6">
                <Button
                  onClick={() => openLink(participant.social.linkedin)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LinkedInIcon />
                </Button>
                <Button
                  onClick={() => openLink(participant.social.github)}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <GitHubIcon />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      
    </main>
  );
};

export default Team;
