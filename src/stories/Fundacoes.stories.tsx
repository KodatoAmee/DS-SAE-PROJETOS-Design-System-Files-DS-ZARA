import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Icon, iconNames } from "../components/icon";

const meta = {
  title: "Fundações",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fundações do DS-Zara. Valores medidos no DOM de zara.com/pt (1440px) em 2026-11-19. Fonte canônica: `tokens/tokens.json`; runtime: `src/styles/theme.css`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mb-18">
      <h2 className="mb-1 text-title-s uppercase">{title}</h2>
      {note && <p className="mb-6 max-w-[640px] text-body text-content-mid">{note}</p>}
      {children}
    </section>
  );
}

const semanticColors: { token: string; cls: string; use: string }[] = [
  { token: "base", cls: "bg-base", use: "Fundo da página" },
  { token: "surface", cls: "bg-surface", use: "Modal, gaveta, painel" },
  { token: "muted", cls: "bg-muted", use: "Mídia vazia, esqueleto, hover" },
  { token: "content", cls: "bg-content", use: "Texto e ícones" },
  { token: "content-mid", cls: "bg-content-mid", use: "Texto secundário" },
  { token: "content-low", cls: "bg-content-low", use: "Rótulo de campo" },
  { token: "content-disabled", cls: "bg-content-disabled", use: "Desabilitado" },
  { token: "line", cls: "bg-line", use: "Contorno de botão" },
  { token: "line-subtle", cls: "bg-line-subtle", use: "Divisores" },
  { token: "line-field", cls: "bg-line-field", use: "Linha de campo" },
  { token: "inverse", cls: "bg-inverse", use: "Botão primário" },
  { token: "on-inverse", cls: "bg-on-inverse", use: "Texto sobre inverse" },
  { token: "danger", cls: "bg-danger", use: "Borda e ícone de erro" },
  { token: "danger-text", cls: "bg-danger-text", use: "Texto de erro" },
  { token: "overlay", cls: "bg-overlay", use: "Fundo de modal" },
];

export const Cor: Story = {
  render: () => (
    <Section
      title="Cor"
      note="Monocromático. Nenhuma cor de marca: a fotografia carrega a cor. Vermelho só para erro. Troque o tema na barra (Claro / Escuro) para ver as semânticas mudarem."
    >
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {semanticColors.map((c) => (
          <div key={c.token}>
            <div className={`h-20 border border-line-subtle ${c.cls}`} />
            <p className="mt-2 text-label-s uppercase">{c.token}</p>
            <p className="text-label-s text-content-mid">{c.use}</p>
          </div>
        ))}
      </div>
    </Section>
  ),
};

const typeScale: { cls: string; name: string; spec: string; caps?: boolean }[] = [
  { cls: "text-display", name: "display", spec: "24/28" },
  { cls: "text-heading", name: "heading", spec: "20/24" },
  { cls: "text-title", name: "title", spec: "16/24" },
  { cls: "text-title-s", name: "title-s", spec: "15/24", caps: true },
  { cls: "text-body", name: "body", spec: "13/20" },
  { cls: "text-action", name: "action", spec: "13/16", caps: true },
  { cls: "text-label", name: "label", spec: "12/16", caps: true },
  { cls: "text-label-s", name: "label-s", spec: "11/16", caps: true },
  { cls: "text-caption", name: "caption", spec: "10/16" },
];

export const Tipografia: Story = {
  render: () => (
    <Section
      title="Tipografia"
      note="Helvetica (a referência usa Helvetica Now Text, licenciada). Peso 300 em quase tudo; 400 para ênfase; 500 para selecionado. Ações e rótulos em maiúsculas. Escala pequena e densa: 13px é a base."
    >
      <div className="divide-y divide-line-subtle border-y border-line-subtle">
        {typeScale.map((t) => (
          <div key={t.name} className="grid grid-cols-[120px_80px_1fr] items-baseline gap-4 py-4">
            <span className="text-label-s uppercase text-content-mid">{t.name}</span>
            <span className="text-label-s text-content-mid">{t.spec}</span>
            <span className={`${t.cls} ${t.caps ? "uppercase" : ""}`}>
              {t.caps ? "Nova coleção" : "Casaco comprido de lã com gola"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-10">
        {(["font-light", "font-normal", "font-medium"] as const).map((w, i) => (
          <div key={w}>
            <p className={`text-title ${w}`}>Aa 300 400 500</p>
            <p className="text-label-s uppercase text-content-mid">{[300, 400, 500][i]}</p>
          </div>
        ))}
      </div>
    </Section>
  ),
};

const spaces = [
  { k: "1", px: 4, cls: "w-1" },
  { k: "2", px: 8, cls: "w-2" },
  { k: "3", px: 12, cls: "w-3" },
  { k: "4", px: 16, cls: "w-4" },
  { k: "5", px: 20, cls: "w-5" },
  { k: "6", px: 24, cls: "w-6" },
  { k: "8", px: 32, cls: "w-8" },
  { k: "10", px: 40, cls: "w-10" },
  { k: "18", px: 72, cls: "w-18" },
];

export const Espaco: Story = {
  name: "Espaço e tamanho",
  render: () => (
    <>
      <Section title="Espaço" note="Base 4px, igual à escala numérica do Tailwind. 40px é a calha da grelha de produtos; 72px separa blocos de formulário.">
        <div className="space-y-3">
          {spaces.map((s) => (
            <div key={s.k} className="flex items-center gap-4">
              <span className="w-10 text-label-s text-content-mid">{s.k}</span>
              <span className={`h-4 bg-content ${s.cls}`} />
              <span className="text-label-s text-content-mid">{s.px}px</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Tamanho" note="Botão 32 (medido), campo 40 (medido), alvo de toque 44. Linha 1px. Raio 0 em tudo.">
        <div className="flex items-end gap-6">
          {[32, 40, 44].map((h) => (
            <div key={h} className="text-center">
              <div className="w-24 border border-line" style={{ height: h }} />
              <p className="mt-2 text-label-s text-content-mid">{h}px</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  ),
};

export const Movimento: Story = {
  render: () => (
    <Section title="Movimento" note="200ms para hover e opacidade; 500ms ease-in-out para painéis, gavetas e carrossel. Tudo cai para ~0ms com prefers-reduced-motion.">
      <div className="flex gap-10">
        {[
          { d: "duration-200", l: "200ms · rápido" },
          { d: "duration-500", l: "500ms · base" },
        ].map((m) => (
          <div key={m.d} className="group w-48 cursor-default">
            <div className="h-24 overflow-hidden border border-line">
              <div className={`h-full w-1/3 bg-inverse transition-transform ease-zr group-hover:translate-x-[200%] ${m.d}`} />
            </div>
            <p className="mt-2 text-label-s uppercase text-content-mid">{m.l} (passe o mouse)</p>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Grelha: Story = {
  render: () => (
    <Section title="Grelha e breakpoints" note="md 768 · lg 1024 · xl 1280 · 2xl 1920. Grelha de produtos com 3 densidades (Vista 1/2/3); calha de 40px a partir de lg.">
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] bg-muted" />
            <p className="mt-2 text-label-s uppercase">Coluna {i + 1}</p>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Iconografia: Story = {
  render: () => (
    <Section title="Iconografia" note="Traço 1px, terminação quadrada, grade 20x20, sem preenchimento. Decorativo por padrão; passe `label` quando o ícone for o único rótulo.">
      <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
        {iconNames.map((n) => (
          <div key={n} className="flex flex-col items-center gap-2 border border-line-subtle py-6">
            <Icon name={n} />
            <span className="text-caption text-content-mid">{n}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};
