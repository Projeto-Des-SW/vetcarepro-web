import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IClinicaList } from "@/interfaces/clinicas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
const baseUrl = import.meta.env.VITE_URL as string;

const DashboardClinica = () => {
  const { id } = useParams();
  const user = useUserSelector((state) => state.user);
  const fetchClinicasList = async (): Promise<IClinicaList[]> => {
    const response = await axios.get(`${baseUrl}/clinics/${id}/patients`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["ClinicaListInternal"],
    queryFn: fetchClinicasList,
  });

  console.log(data);

  return (
    <section className="flex h-full">
      <main className="flex-1bg-background p-8 flex flex-col">
        <div className="grid grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">1,234</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">87</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$45,231.89</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$12,345.67</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Patients by Species</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Appointments by Month</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </>
          )}
        </div>
        <div className="mt-8">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Guardião</TableHead>
                      <TableHead>idade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.species}</TableCell>
                        <TableCell>{item.guardian_name}</TableCell>
                        <TableCell>{item.age}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </section>
  );
};

export default DashboardClinica;
