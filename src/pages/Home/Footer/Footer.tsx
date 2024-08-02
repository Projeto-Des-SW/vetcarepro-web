import { Toaster } from "@/components/ui/sonner";

const Footer = () => {
  return (
    <footer className="bg-[#AAFAEF] h-[80px] flex justify-evenly items-center">
      <Toaster />
      <p className="font-bold text-3xl">VetCare</p>
      Todos os direitos reservados - VetCare 2024
      <p>Social Midia</p>
    </footer>
  );
};

export default Footer;
