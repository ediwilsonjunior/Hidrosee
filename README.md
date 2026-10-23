# FluxoVerde DERP v2

Protótipo frontend modular para estoque, compras, logística e reposição sensível a risco de estiagem.

## Recursos

- estoque separado por organização;
- movimentações com saldo anterior e posterior;
- compras com quantidades solicitadas, aprovadas, enviadas e recebidas;
- recebimento parcial e entrada automática no estoque;
- timeline de entregas;
- fornecedores e rotas;
- alertas tratáveis;
- projeção diária por produto, considerando consumo e compras em trânsito;
- janela de compra ajustada pelo risco;
- parâmetros configuráveis;
- layout responsivo, incluindo cartões em celulares.

## Executar

Como o JavaScript usa módulos, execute por um servidor local:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000/fluxoverde-derp-v2/`.

## GitHub Pages

Envie a pasta inteira preservando `css/` e `js/`. Em **Settings > Pages**, publique a branch `main` pela raiz.

## Limitações

É um frontend estático com `localStorage`. Não há autenticação real, banco compartilhado, API climática, GPS ou sincronização entre dispositivos. Os dados e coeficientes são demonstrativos. Para produção, implemente API, PostgreSQL, autorização por organização, auditoria e integração com fontes meteorológicas e hidrológicas oficiais.

## Alteração metodológica da versão 3

O antigo “coeficiente climático 0,65” foi substituído por **fatores experimentais de impacto logístico por rota**. Os valores iniciais são hipóteses demonstrativas: urbana 0,10; fluvial de baixa sensibilidade 0,35; moderada 0,65; alta 0,90.

A interface declara que esses números não foram calibrados. Ela também inclui uma calculadora de fator observado:

```text
fator observado = (prazo efetivo - prazo-base) / (prazo-base × risco decimal)
```

Uma calibração real exige várias viagens por rota e dados de nível do rio, chuva, embarcação, carga, paradas e ocorrências.
