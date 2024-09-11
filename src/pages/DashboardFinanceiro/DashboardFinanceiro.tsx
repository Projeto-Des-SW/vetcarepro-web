import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BarChart, LineChart, PieChart } from 'lucide-react'

const DashboardFinanceiro = () => {
  return (
    <main className="flex-1">
        <section className="w-full">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Painel Financeiro</h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex flex-col items-start justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <DollarSignIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Receita Total</h3>
                        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary">R$ 125.000,00</div>
                  </CardHeader>
                  <CardContent className="p-6 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variação:</span>
                      <span className="text-green-500 font-medium">+12%</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex flex-col items-start justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <CreditCardIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Contas a Receber</h3>
                        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary">R$ 32.500,00</div>
                  </CardHeader>
                  <CardContent className="p-6 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variação:</span>
                      <span className="text-red-500 font-medium">-5%</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex flex-col items-start justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <WalletIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Contas a Pagar</h3>
                        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary">R$ 18.200,00</div>
                  </CardHeader>
                  <CardContent className="p-6 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variação:</span>
                      <span className="text-green-500 font-medium">+3%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <BarChartIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Fluxo de Caixa</h3>
                        <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-primary">
                      Ver Detalhes
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <LineChart className="w-full aspect-[4/3]" />
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <PieChartIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Receita por Serviço</h3>
                        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-primary">
                      Ver Detalhes
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PieChart className="w-full aspect-square" />
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-lg">
                  <CardHeader className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      {/* <BarChartIcon className="h-8 w-8 text-primary" /> */}
                      <div>
                        <h3 className="text-lg font-semibold">Despesas por Categoria</h3>
                        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-primary">
                      Ver Detalhes
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <BarChart className="w-full aspect-[4/3]" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
  )
}

export default DashboardFinanceiro