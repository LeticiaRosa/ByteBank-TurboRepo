export const TRANSACTION_CATEGORIES = [
  { value: "all", label: "Todas as categorias" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "compras", label: "Compras" },
  { value: "casa", label: "Casa" },
  { value: "trabalho", label: "Trabalho" },
  { value: "investimentos", label: "Investimentos" },
  { value: "viagem", label: "Viagem" },
  { value: "outros", label: "Outros" },
] as const;

export const TRANSACTION_CATEGORIES_WITHOUT_ALL = TRANSACTION_CATEGORIES.filter(
  (category) => category.value !== "all"
);

export type TransactionCategoryValue =
  (typeof TRANSACTION_CATEGORIES)[number]["value"];
export type TransactionCategoryWithoutAll =
  (typeof TRANSACTION_CATEGORIES_WITHOUT_ALL)[number]["value"];
