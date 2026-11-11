"use client";

import { useState } from "react";
import axios from "axios";
import { RestartAltRounded, TrendingUpRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Slider,
  Chip,
} from "@mui/material";
import { FEATURES, initialPredictionValues } from "@/constants/features";
import api from "@/services/api";
import type { PredictionField, PredictionRequest, PredictionResponse } from "@/types/prediction";
import { PredictionResult } from "./PredictionResult";

type FormValues = Record<PredictionField, string>;

function createInitialValues(): FormValues {
  return { ...initialPredictionValues } as FormValues;
}

export function PredictionForm() {
  const [values, setValues] = useState<FormValues>(createInitialValues);
  const [model, setModel] = useState<"random_forest" | "logistic_regression">("random_forest");
  const [threshold, setThreshold] = useState(0.5);
  const [examples, setExamples] = useState<Array<{
    label: string; observed_churn: number; features: Record<string, number>;
  }>>([]);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [exampleError, setExampleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const updateField = (field: PredictionField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setResult(null);
    setSelectedExample(null);
  };

  const reset = () => {
    setValues(createInitialValues());
    setResult(null);
    setError(null);
    setModel("random_forest");
    setThreshold(0.5);
    setSelectedExample(null);
  };

  const loadExamples = async () => {
    setExampleError("");
    try {
      const { data } = await api.get<typeof examples>("/analytics/examples");
      setExamples(data);
      if (!data.length) setExampleError("A base não possui exemplos disponíveis.");
    } catch {
      setExampleError("Não foi possível carregar exemplos reais. Verifique a API.");
    }
  };

  const selectExample = (index: number) => {
    const example = examples[index];
    if (!example) return;
    const next = {} as FormValues;
    for (const feature of FEATURES) {
      next[feature.apiName] = String(example.features[feature.apiName]);
    }
    setValues(next);
    setSelectedExample(index);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = Object.fromEntries(
      FEATURES.map((feature) => [feature.apiName, Number(values[feature.apiName])]),
    ) as unknown as PredictionRequest;
    const request = { ...payload, model_name: model, threshold };

    try {
      const response = await api.post<PredictionResponse>("/predict", request);
      setResult(response.data);
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) && requestError.response
        ? "A API não conseguiu processar os dados. Revise os campos ou verifique o serviço."
        : "Não foi possível conectar à API de previsão. Confirme se o backend está em execução.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
          <Box mb={3}>
            <Typography variant="h6">Dados do cliente</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Preencha os 13 atributos conforme as definições do Iranian Churn Dataset.
            </Typography>
          </Box>
          <Box sx={{ p: 2, mb: 3, bgcolor: "primary.light", borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}
              alignItems={{ sm: "center" }} justifyContent="space-between">
              <Box>
                <Typography fontWeight={700}>Exemplos reais para demonstrar</Typography>
                <Typography variant="body2">Carregue observações anônimas da base e calcule o risco.</Typography>
              </Box>
              <Button variant="outlined" onClick={() => void loadExamples()}>
                Carregar exemplos da base
              </Button>
            </Stack>
            {!!exampleError && <Alert severity="warning" sx={{ mt: 2 }}>{exampleError}</Alert>}
            {!!examples.length && <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
              {examples.map((example, index) => <Chip key={index}
                color={selectedExample === index ? "primary" : "default"}
                variant={selectedExample === index ? "filled" : "outlined"}
                label={"Exemplo observado: " + example.label}
                onClick={() => selectExample(index)}
              />)}
            </Stack>}
            {selectedExample !== null && <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Observação da base, não necessariamente do conjunto de teste.
              A comparação não constitui validação independente.
            </Typography>}
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="prediction-model-label">Modelo de Machine Learning</InputLabel>
                <Select labelId="prediction-model-label" label="Modelo de Machine Learning"
                  value={model} onChange={event => { setModel(event.target.value as typeof model); setResult(null); }}>
                  <MenuItem value="random_forest">Random Forest</MenuItem>
                  <MenuItem value="logistic_regression">Regressão Logística</MenuItem>
                </Select>
                <FormHelperText>Compare as previsões de cada algoritmo.</FormHelperText>
              </FormControl>
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  Limiar de decisão: {(threshold * 100).toFixed(0)}%
                </Typography>
                <Slider aria-label="Limiar de decisão" value={threshold}
                  min={0.05} max={0.95} step={0.05} valueLabelDisplay="auto"
                  onChange={(_, value) => { setThreshold(value as number); setResult(null); }}
                  marks={[{ value: 0.2, label: "20%" }, { value: 0.5, label: "50%" }, { value: 0.8, label: "80%" }]}
                />
                <Typography variant="caption" color="text.secondary">
                  Um limiar menor sinaliza mais clientes. A probabilidade do modelo não muda.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 2.5 }}>
              {FEATURES.map((feature) => feature.options ? (
                <FormControl key={feature.apiName} required fullWidth>
                  <InputLabel id={`${feature.apiName}-label`}>{feature.label}</InputLabel>
                  <Select
                    labelId={`${feature.apiName}-label`}
                    value={values[feature.apiName]}
                    label={feature.label}
                    onChange={(event) => updateField(feature.apiName, event.target.value)}
                  >
                    {feature.options.map((option) => <MenuItem key={option.value} value={String(option.value)}>{option.label}</MenuItem>)}
                  </Select>
                  <FormHelperText>{feature.description}</FormHelperText>
                </FormControl>
              ) : (
                <TextField
                  key={feature.apiName}
                  required
                  fullWidth
                  type="number"
                  label={feature.label}
                  value={values[feature.apiName]}
                  onChange={(event) => updateField(feature.apiName, event.target.value)}
                  helperText={feature.description}
                  slotProps={{ htmlInput: { min: feature.min, step: feature.step } }}
                />
              ))}
            </Box>
            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5} mt={3}>
              <Button type="button" variant="outlined" startIcon={<RestartAltRounded />} onClick={reset} disabled={loading}>Limpar campos</Button>
              <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <TrendingUpRounded />} disabled={loading}>
                {loading ? "Calculando..." : "Calcular risco de churn"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      {result && <PredictionResult result={result} />}
    </Stack>
  );
}
