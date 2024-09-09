import axios from "axios";
const baseUrl = import.meta.env.VITE_URL as string;

export const handleDeleteClinic = async (clinicaId: string, token?: string) => {
  if (window.confirm("Tem certeza que deseja deletar esta clínica?")) {
    try {
      await axios.delete(`${baseUrl}/clinics/${clinicaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erro ao deletar a clínica", error);
    }
  }
};

export const handleDeletePacient = async (clinicaId?: string, id?: string, token?: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta clínica?")) {
      try {
        await axios.delete(`${baseUrl}/clinics/${clinicaId}/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Erro ao deletar a clínica", error);
      }
    }
  };
  