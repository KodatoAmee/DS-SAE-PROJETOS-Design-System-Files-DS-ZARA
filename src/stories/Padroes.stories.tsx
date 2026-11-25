import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Breadcrumbs,
  Button,
  Divider,
  Drawer,
  Footer,
  Header,
  MediaPlaceholder,
  MenuDrawer,
  PriceLabel,
  ProductCard,
  ProductGrid,
  QuantityStepper,
  SizeSelector,
  TextField,
  ViewSelector,
  type ProductGridView,
} from "../index";

const meta = {
  title: "Padrões",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Telas compostas só com componentes do DS. Servem de referência de composição, não de produto real: nomes, preços e imagens são fictícios.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const logo = <span className="text-display font-light tracking-[0.3em]">MAISON</span>;

const sections = [
  {
    id: "mulher",
    label: "Mulher",
    items: ["Novidades", "Casacos", "Blazers", "Malhas", "Calças", "Sapatos"].map((l) => ({ label: l, href: "#" })),
  },
  {
    id: "homem",
    label: "Homem",
    items: ["Novidades", "Casacos", "Camisas", "Calças"].map((l) => ({ label: l, href: "#" })),
  },
  {
    id: "casa",
    label: "Casa",
    items: ["Têxteis", "Mesa", "Decoração"].map((l) => ({ label: l, href: "#" })),
  },
];

const products = [
  { name: "Blazer de lã", amount: 89.95 },
  { name: "Camisa de linho", amount: 35.95 },
  { name: "Calça de alfaiataria", amount: 49.95, compareAt: 59.95 },
  { name: "Casaco comprido", amount: 129 },
  { name: "Malha de gola alta", amount: 39.95 },
  { name: "Saia midi plissada", amount: 45.95 },
  { name: "Trench coat", amount: 119 },
  { name: "Colete de malha", amount: 29.95 },
];

const footerColumns = [
  { title: "Ajuda", links: [{ label: "Compras", href: "#" }, { label: "Pagamentos", href: "#" }, { label: "Devoluções", href: "#" }] },
  { title: "Siga-nos", links: [{ label: "Instagram", href: "#" }, { label: "Pinterest", href: "#" }] },
  { title: "Empresa", links: [{ label: "Sobre nós", href: "#" }, { label: "Lojas", href: "#" }] },
  { title: "Políticas", links: [{ label: "Privacidade", href: "#" }, { label: "Cookies", href: "#" }] },
];

function Page() {
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);
  const [count, setCount] = useState(0);
  const [view, setView] = useState<ProductGridView>(2);

  return (
    <div className="-m-6">
      <Header
        variant="solid"
        sticky
        logo={logo}
        menuOpen={menu}
        menuId="menu-principal"
        onMenuClick={() => setMenu(true)}
        search={{ onClick: () => {} }}
        actions={[
          { label: "Iniciar sessão", icon: "user", href: "#" },
          { label: "Ajuda", icon: "help", href: "#" },
          { label: "Cesto", icon: "bag", count, onClick: () => setCart(true) },
        ]}
      />
      <MenuDrawer id="menu-principal" open={menu} onOpenChange={setMenu} sections={sections} />

      <main className="px-5 pb-18 lg:px-0">
        <div className="flex items-center justify-between py-6 lg:px-10">
          <Breadcrumbs items={[{ label: "Mulher", href: "#" }, { label: "Blazers" }]} />
          <ViewSelector
            options={[1, 2, 3]}
            value={view}
            onValueChange={(v) => setView(v as ProductGridView)}
          />
        </div>
        <ProductGrid view={view}>
          {products.map((p, i) => (
            <ProductCard
              key={p.name}
              href="#"
              name={p.name}
              tag={i === 0 ? "New" : undefined}
              colors={i % 3 === 0 ? 2 : undefined}
              price={{ amount: p.amount, compareAt: p.compareAt }}
              onQuickAdd={() => setCount((c) => c + 1)}
            />
          ))}
        </ProductGrid>
      </main>

      <Footer
        columns={footerColumns}
        region={{ country: "Portugal", language: "Português" }}
        legal="© 2026 Maison. Exemplo fictício para documentação."
      />

      <Drawer
        open={cart}
        onOpenChange={setCart}
        title={`Cesto (${count})`}
        footer={
          <div className="space-y-4">
            <div className="flex justify-between text-action uppercase">
              <span>Total</span>
              <PriceLabel amount={count * 89.95} />
            </div>
            <Button fullWidth size="l" disabled={count === 0}>
              Continuar
            </Button>
          </div>
        }
      >
        {count === 0 ? (
          <p className="text-body text-content-mid">O seu cesto está vazio.</p>
        ) : (
          <div className="flex gap-4">
            <MediaPlaceholder aspect="2/3" className="w-24" />
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-label-s uppercase">Blazer de lã</p>
              <PriceLabel amount={89.95} />
              <QuantityStepper value={count} min={1} onValueChange={setCount} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export const PaginaDeCategoria: Story = {
  name: "Página de categoria",
  render: () => <Page />,
};

export const FichaDeProduto: Story = {
  name: "Ficha de produto",
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-18">
      <div className="grid grid-cols-2 gap-1">
        <MediaPlaceholder aspect="2/3" />
        <MediaPlaceholder aspect="2/3" />
        <MediaPlaceholder aspect="2/3" />
        <MediaPlaceholder aspect="2/3" />
      </div>
      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-2">
          <h1 className="text-title-s uppercase">Blazer de lã</h1>
          <PriceLabel amount={89.95} />
        </div>
        <p className="text-body">
          Blazer de corte direito em lã. Gola de lapela, bolsos com aba e forro interior. Fecho com
          botão.
        </p>
        <Divider />
        <SizeSelector
          label="Tamanho"
          options={[
            { value: "XS" },
            { value: "S" },
            { value: "M", availability: "low" },
            { value: "L", availability: "soldOut" },
            { value: "XL" },
          ]}
        />
        <Button fullWidth size="l">
          Adicionar
        </Button>
      </div>
    </div>
  ),
};

export const IniciarSessao: Story = {
  name: "Iniciar sessão",
  parameters: { layout: "padded" },
  render: () => (
    <form className="mx-auto mt-10 max-w-[398px] space-y-6" onSubmit={(e) => e.preventDefault()}>
      <h1 className="text-title-s uppercase">Iniciar sessão ou registrar</h1>
      <TextField label="E-mail" type="email" placeholder="Digite o seu e-mail" autoComplete="email" />
      <TextField label="Senha" type="password" autoComplete="current-password" />
      <Button type="submit" fullWidth>
        Continuar
      </Button>
      <p className="pt-18 text-label">
        Ao continuar, aceita as condições de uso e a política de privacidade.
      </p>
    </form>
  ),
};
