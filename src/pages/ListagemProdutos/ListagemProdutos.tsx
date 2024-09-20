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
import { useState } from "react";
import PIX from "react-qrcode-pix";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { toast } from "sonner";

const ListagemProdutos = () => {
  const user = useUserSelector((state) => state.user);
  const { idClinica } = useParams();
  const [openNewProduct, setOpenNewProduct] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [mode, setMode] = useState(false);
  const [currentIdEdit, setCurrentIdEdit] = useState("");
  const queryClient = useQueryClient();
  const [showPix, setShowPix] = useState(false);
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_URL as string;
  console.log("carrinho", user.cart);

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

  if (isPending || isPendingPaciente) return <div>carrgando</div>;

  let total = 0;
  if (user.cart.length > 0) {
    total = user.cart.reduce((total, produto) => {
      return total + parseFloat(produto.amount) * produto.quantity;
    }, 0);

    console.log(total);
  }

  return (
    <div className="w-full h-full">
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
                        {product.quantity}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          dispatch(setIncrementItemCart(product.id))
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      $
                      {(parseFloat(product.amount) * product.quantity).toFixed(
                        2
                      )}
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
        <h2
          className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${
            user.isDarkMode && "text-white "
          }`}
        >
          Seus produtos
        </h2>

        <Button onClick={() => handleChangeMode(true)}>
          Adicionar produto
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {data.map((product) => (
          <Card key={product.id} className="bg-background shadow-lg">
            <CardHeader className="flex">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <div className="text-3xl font-bold text-primary">
                    ${parseFloat(product.amount).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button onClick={() => handleChangeMode(false, product.id)}>
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => mutation.mutate(product.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Quantidade disponivel: {product.quantity}
              </p>
            </CardHeader>
            <CardContent className="p-6 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  dispatch(setItemCart(product));
                  toast(`Produto adicionado ao carrinho com sucesso`, {
                    description: product.title,
                  });
                }}
              >
                Adicionar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bottom-[80px] absolute right-0 p-8">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenCart((prevState) => !prevState)}
        >
          <ShoppingCart />
        </Fab>
      </div>
    </div>
  );
};

export default ListagemProdutos;