# Metodologia demonstrativa do HidroSee

## Equações usadas

**Autonomia:** `A = piso(E / C)`  
E = estoque disponível; C = consumo médio diário.

**Lead time ajustado:** `La = teto(L0 × F)`  
L0 = lead time normal. No protótipo: F normal = 1,00; moderado = 1,30; severo = 1,65.

**Margem logística:** `M = A - La`  
Uma margem positiva significa que a carga chega antes do esgotamento. Uma margem negativa indica ruptura provável.

**Ponto de pedido:** `PP = teto(C × La × (1 + S/100))`  
S = percentual de estoque de segurança.

## Classificação corrigida
- **Crítico:** M ≤ -7 dias ou La ≥ 1,25 × A.
- **Alto:** M < 0, sem atingir o critério crítico.
- **Moderado:** 0 ≤ M ≤ 5 dias.
- **Baixo:** M > 5 dias.

Logo, autonomia de 26 dias e lead time de 24 dias resulta em margem +2 e risco **Moderado**. Autonomia de 22 dias e lead time de 41 dias resulta em margem -19 e risco **Crítico**.

## Índice futuro de impacto da estiagem
A evolução sugerida é: `I = 0,35H + 0,30T + 0,20D + 0,15U`, em escala de 0 a 100.
- H: severidade hidrológica.
- T: atraso na entrada de cargas de outras regiões.
- D: dependência fluvial do município.
- U: dificuldade da última milha.

Conversão sugerida: `F = 1 + 0,65 × (I/100)`.

## Natureza dos dados
Cada combinação de município e insumo recebe estoque, consumo, lead time e segurança próprios, gerados de forma determinística. Os valores são plausíveis para demonstração e permanecem estáveis ao recarregar, mas não são dados oficiais.

Antes de uso real, o modelo deve ser calibrado com séries da ANA e do Serviço Geológico do Brasil, histórico de transporte, consumo das UBS, sazonalidade epidemiológica e tempos reais dos fornecedores.
