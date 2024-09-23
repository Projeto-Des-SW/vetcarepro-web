import CadastrarProduto from "@/components/CadastrarProduto/CadastrarProduto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { handleDeleteProduct } from "@/services/deleteServices";
import { fetchPacientsList, fetchProductList } from "@/services/getServices";
import { useUserSelector } from "@/store/hooks";
import {
  addNotification,
  setClearCart,
  setDecrementItemCart,
  setIncrementItemCart,
  setItemCart,
  setRemoveItemCart,
} from "@/store/user-slice";
import { Fab } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  MinusIcon,
  PackageIcon,
  Pencil,
  PlusIcon,
  ShoppingCart,
  Trash2,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import PIX from "react-qrcode-pix";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { toast } from "sonner";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

const ListagemProdutos = () => {
  const user = useUserSelector((state) => state.user);
  const { idClinica } = useParams();
  const [openNewProduct, setOpenNewProduct] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [mode, setMode] = useState(false);
  const [currentIdEdit, setCurrentIdEdit] = useState("");
  const queryClient = useQueryClient();
  const [showPix, setShowPix] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_URL as string;

  const { data, isPending } = useQuery({
    queryKey: ["ProductList"],
    queryFn: () => fetchProductList(idClinica, user.token),
  });

  const { data: dataPaciente, isPending: isPendingPaciente } = useQuery({
    queryKey: ["PacienteList"],
    queryFn: () => fetchPacientsList(idClinica, user.token),
  });

  const handleChangeMode = (mode: boolean, id?: string) => {
    setOpenNewProduct(true);
    setMode(mode ? true : false);
    setCurrentIdEdit(id);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["ProductList"] });
  };

  const handleClick = () => {
    if (!isDragging) {
      setOpenCart(true);
    }
  };

  const mutation = useMutation({
    mutationFn: (id?: string) => handleDeleteProduct(idClinica, id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ProductList"] });
    },
  });

  const mutationCart = useMutation({
    mutationFn: async () => {
      const requestData = {
        clinic_id: idClinica,
        patient_id: dataPaciente[0].id,
        products: user.cart.flatMap((item) =>
          item.quantity > 0 ? Array(item.quantity).fill(item.id) : []
        ),
      };

      const response = await axios.post(
        `${baseUrl}/clinics/${idClinica}/sales`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Dados recebidos:", data);
      dispatch(setClearCart());
    },
    onError: (error) => {
      console.error("Erro:", error);
    },
  });

  let total = 0;
  if (user.cart.length > 0) {
    total = user.cart.reduce((total, produto) => {
      console.log(produto.amount);
      return total + parseFloat(produto.amount) * produto.quantity;
    }, 0);

    console.log(total);
  }

  return (
    <div className="w-full h-full" ref={constraintsRef}>
      <Dialog
        open={openNewProduct}
        onOpenChange={() => {
          setOpenNewProduct(false);
          handleRefresh();
        }}
      >
        <DialogContent className="max-w-3xl w-full">
          <DialogTitle>Product</DialogTitle>
          <DialogHeader>
            <DialogDescription className="w-full">
              <CadastrarProduto
                mode={mode ? "create" : "edit"}
                id={currentIdEdit}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openCart}
        onOpenChange={() => {
          setOpenCart(false);
        }}
      >
        <DialogContent className="max-w-3xl w-full">
          <DialogTitle>Carrinho</DialogTitle>
          <DialogHeader>
            <DialogDescription className="w-full flex flex-col gap-2">
              {user.cart.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-background p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground w-12 h-12">
                      <PackageIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          dispatch(setDecrementItemCart(product.id))
                        }
                        disabled={product.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <div className="text-lg font-semibold">
                        {product.cartQuantity}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={product.cartQuantity + 1 > product.quantity}
                        onClick={() =>
                          dispatch(setIncrementItemCart(product.id))
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      $
                      {(
                        parseFloat(product.amount) * product.cartQuantity
                      ).toFixed(2)}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => dispatch(setRemoveItemCart(product.id))}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="w-full border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Total</h3>
                  <div className="text-3xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowPix((prevState) => !prevState)}
                  >
                    <PixIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      mutationCart.mutate();
                      setOpenCart(false);
                    }}
                  >
                    <CreditScoreIcon />
                  </Button>
                </div>
              </div>
              {showPix && (
                <div className="flex flex-col items-center">
                  <h2
                    className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
                      user.isDarkMode && "text-white "
                    }`}
                  >
                    Pagamento via pix
                  </h2>
                  <PIX
                    pixkey={user.chavePix || ""}
                    merchant="Pedro"
                    city="Feira Nova"
                    amount={total}
                  />
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <header className="flex justify-between pb-4">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/listagemClinica">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/internalClinica/${idClinica}/dashboard`}>
                    Minha Clinica
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Meus Produtos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2
            className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
              user.isDarkMode && "text-white "
            }`}
          >
            Seus Produtos
          </h2>
        </div>

        <Button onClick={() => handleChangeMode(true)}>
          Novo produto
        </Button>
      </header>

      <div className="grid grid-cols-4 gap-8">
        {isPending || isPendingPaciente
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="bg-background shadow-lg">
                <CardHeader className="flex">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="p-6 border-t flex gap-2 w-full flex-wrap relative bottom-0">
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-12" />
                </CardContent>
              </Card>
            ))
          : data.map((product) => {
              const currentProduct = user.cart.filter(
                (productC) => productC.id === product.id
              );
              return (
                <Card key={product.id} className="bg-background shadow-lg">
                  <CardHeader className="flex">
                    <div className="flex justify-between">
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[150px]">
                                {product.title}
                              </h3>
                              {product.quantity === 0 && (
                                <Badge variant="destructive" className="ml-2">
                                  Esgotado
                                </Badge>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>{product.title} </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="text-3xl font-bold text-primary">
                          ${parseFloat(product.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Quantidade disponível: {product.quantity}
                    </p>
                  </CardHeader>

                  <CardContent className="p-6 border-t flex gap-2 w-full relative bottom-0">
                    <Button
                      className="w-full"
                      disabled={
                        (currentProduct[0]?.cartQuantity || 0) + 1 >
                        product.quantity
                      }
                      onClick={() => {
                        dispatch(setItemCart(product));

                        toast(`Produto adicionado ao carrinho com sucesso`, {
                          description: product.title,
                        });

                        dispatch(
                          addNotification({
                            title: "Produto adicionado ao carrinho com sucesso",
                            description: product.title,
                          })
                        );
                      }}
                    >
                      <AddShoppingCartIcon />
                    </Button>
                    <Button
                      onClick={() => handleChangeMode(false, product.id)}
                      variant="outline"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => mutation.mutate(product.id)}
                    >
                      <Trash2 />
                    </Button>
                    <div className="flex "></div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="bottom-[0px] absolute right-0 p-8"
      >
        <Fab
          color="primary"
          aria-label="add"
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <ShoppingCart onClick={handleClick} />
        </Fab>
      </motion.div>
    </div>
  );
};

export default ListagemProdutos;
