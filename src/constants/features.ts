import type { PredictionField } from "@/types/prediction";

export interface FeatureOption {
  value: number;
  label: string;
}

export interface FeatureConfig {
  apiName: PredictionField;
  label: string;
  type: "number" | "categorical" | "ordinal";
  /** What the field means, in plain language. */
  description: string;
  /** Unit shown inside the input (e.g. "meses"). */
  unit?: string;
  /** Range observed in the dataset, to guide the user. */
  range?: string;
  min?: number;
  step?: number;
  options?: FeatureOption[];
}

// Representative age stored by the dataset for each age group.
export const AGE_BY_GROUP: Record<number, number> = { 1: 15, 2: 25, 3: 30, 4: 45, 5: 55 };

export const FEATURES: readonly FeatureConfig[] = [
  {
    apiName: "Status", label: "Status do cliente", type: "categorical",
    description: "Se o cliente continua usando a linha ou está parado.",
    options: [{ value: 1, label: "Ativo — usa o serviço normalmente" }, { value: 2, label: "Inativo — pouco ou nenhum uso" }],
  },
  {
    apiName: "Complains", label: "Fez reclamação?", type: "categorical",
    description: "Se o cliente registrou alguma reclamação na operadora.",
    options: [{ value: 0, label: "Não — nunca reclamou" }, { value: 1, label: "Sim — registrou reclamação" }],
  },
  {
    apiName: "Tariff Plan", label: "Tipo de plano", type: "categorical",
    description: "Forma de cobrança do plano do cliente.",
    options: [{ value: 1, label: "Pago conforme o uso (pré-pago)" }, { value: 2, label: "Contrato (plano contratado)" }],
  },
  {
    apiName: "Subscription Length", label: "Tempo de assinatura", type: "number", unit: "meses",
    description: "Há quantos meses a pessoa é cliente da operadora.",
    range: "Na base: de 3 a 47 meses (comum: 35)", min: 0, step: 1,
  },
  {
    apiName: "Charge Amount", label: "Faixa de valor cobrado", type: "ordinal",
    description: "Quanto o cliente paga, em 11 níveis: 0 é o menor valor e 10 o maior.",
    options: Array.from({ length: 11 }, (_, value) => ({
      value,
      label: value === 0 ? "Nível 0 — menor valor" : value === 10 ? "Nível 10 — maior valor" : `Nível ${value}`,
    })),
  },
  {
    apiName: "Customer Value", label: "Valor do cliente", type: "number", unit: "pontos",
    description: "Pontuação calculada pela operadora: quanto maior, mais valioso é o cliente.",
    range: "Na base: de 0 a 2.165 (comum: 233)", min: 0, step: 0.01,
  },
  {
    apiName: "Frequency of use", label: "Quantidade de ligações", type: "number", unit: "ligações",
    description: "Total de ligações que o cliente fez no período analisado.",
    range: "Na base: de 0 a 255 (comum: 55)", min: 0, step: 1,
  },
  {
    apiName: "Seconds of Use", label: "Tempo total em ligações", type: "number", unit: "segundos",
    description: "Soma da duração de todas as ligações, em segundos (3.600 s = 1 hora).",
    range: "Na base: de 0 a 17.090 s (comum: 3.041 s ≈ 51 min)", min: 0, step: 1,
  },
  {
    apiName: "Frequency of SMS", label: "Quantidade de SMS", type: "number", unit: "SMS",
    description: "Total de mensagens de texto enviadas no período analisado.",
    range: "Na base: de 0 a 522 (comum: 22)", min: 0, step: 1,
  },
  {
    apiName: "Distinct Called Numbers", label: "Números diferentes chamados", type: "number", unit: "números",
    description: "Para quantos números de telefone diferentes o cliente ligou.",
    range: "Na base: de 0 a 97 (comum: 21)", min: 0, step: 1,
  },
  {
    apiName: "Call Failure", label: "Falhas de chamada", type: "number", unit: "falhas",
    description: "Quantas ligações do cliente caíram ou não completaram.",
    range: "Na base: de 0 a 36 (comum: 6)", min: 0, step: 1,
  },
  {
    apiName: "Age Group", label: "Faixa etária", type: "ordinal",
    description: "Grupo de idade do cliente. Ao escolher a faixa, a idade é preenchida junto.",
    options: [1, 2, 3, 4, 5].map(value => ({
      value,
      label: `Faixa ${value} — ${AGE_BY_GROUP[value]} anos${value === 1 ? " (mais jovem)" : value === 5 ? " (mais velha)" : ""}`,
    })),
  },
  {
    apiName: "Age", label: "Idade", type: "number",
    description: "A base registra uma idade por faixa etária. Ao escolher a idade, a faixa é preenchida junto.",
    options: [1, 2, 3, 4, 5].map(group => ({ value: AGE_BY_GROUP[group], label: `${AGE_BY_GROUP[group]} anos` })),
  },
] as const;

export const initialPredictionValues = FEATURES.reduce<Partial<Record<PredictionField, string>>>((values, feature) => {
  values[feature.apiName] = "";
  return values;
}, {});
