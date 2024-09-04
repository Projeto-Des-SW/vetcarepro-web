import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from "@/interfaces/usuario";
import { useUserSelector } from "@/store/hooks";
import { logoutUser } from "@/store/user-slice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Me = () => {
  const baseUrl = import.meta.env.VITE_URL as string;
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchClinicasList = async (): Promise<IUser> => {
    const response = await axios.get(`${baseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchClinicasList,
  });

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/home");
  };

  if (isLoading) {
    return <p>Carregando</p>;
  }
  return (
    <section className="flex flex-col justify-center items-center ">
      <div className=" border-4 rounded-lg flex flex-col items-center p-4 gap-6">
        <picture>
          <Avatar className="w-[100px] h-[100px]">
            <AvatarFallback>{data?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </picture>
        <div className="flex gap-4 ">
          <Input readOnly value={data?.name} />
          <Input readOnly value={data?.email} />
        </div>

        <p>Nivel da conta: Enterprise</p>
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </section>
  );
};

export default Me;
