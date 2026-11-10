import type { PredictionField } from "@/types/prediction";

export interface FeatureOption {
  value: number;
  label: string;
}

export interface FeatureConfig {
  apiName: PredictionField;
  label: string;
  type: "number" | "categorical" | "ordinal";
  description: string;
  min?: number;
  step?: number;
  options?: FeatureOption[];
}

export const FEATURES: readonly FeatureConfig[] = [
  { apiName: "Call Failure", label: "Falhas de chamada", type: "number", description: "Quantidade de falhas de chamada", min: 0, step: 1 },
  { apiName: "Subscription Length", label: "Tempo de assinatura", type: "number", description: "Duração da assinatura do cliente", min: 0, step: 1 },
  { apiName: "Seconds of Use", label: "Segundos de uso", type: "number", description: "Tempo total de uso em segundos", min: 0, step: 1 },
  { apiName: "Frequency of use", label: "Frequência de uso", type: "number", description: "Frequência total de utilização", min: 0, step: 1 },
  { apiName: "Frequency of SMS", label: "Frequência de SMS", type: "number", description: "Quantidade/frequência de SMS", min: 0, step: 1 },
  { apiName: "Distinct Called Numbers", label: "Números distintos chamados", type: "number", description: "Total de números diferentes contatados", min: 0, step: 1 },
  { apiName: "Age", label: "Idade", type: "number", description: "Idade do cliente em anos", min: 0, step: 1 },
  { apiName: "Customer Value", label: "Valor do cliente", type: "number", description: "Indicador numérico de valor do cliente", min: 0, step: 0.01 },
  { apiName: "Complains", label: "Possui reclamação?", type: "categorical", description: "Registro de reclamação do cliente", options: [{ value: 0, label: "Não" }, { value: 1, label: "Sim" }] },
  { apiName: "Tariff Plan", label: "Plano tarifário", type: "categorical", description: "Código do plano tarifário", options: [{ value: 1, label: "Plano 1" }, { value: 2, label: "Plano 2" }] },
  { apiName: "Status", label: "Status do cliente", type: "categorical", description: "Código de status no conjunto de dados", options: [{ value: 1, label: "Status 1" }, { value: 2, label: "Status 2" }] },
  { apiName: "Charge Amount", label: "Faixa de cobrança", type: "ordinal", description: "Categoria ordinal do valor cobrado", options: Array.from({ length: 11 }, (_, value) => ({ value, label: `Nível ${value}` })) },
  { apiName: "Age Group", label: "Faixa etária", type: "ordinal", description: "Grupo etário codificado no conjunto de dados", options: Array.from({ length: 5 }, (_, index) => ({ value: index + 1, label: `Grupo ${index + 1}` })) },
] as const;

export const initialPredictionValues = FEATURES.reduce<Partial<Record<PredictionField, string>>>((values, feature) => {
  values[feature.apiName] = "";
  return values;
}, {});
