# LP B Upgrade Premium v1 Campanha OAB, documentação

Versão: v1, de 01/10/2026. A LP B é a página que antes aparecia nos arquivos de trabalho como "LP C v1" (`lp_mockups/lp_c_v1.html`). A única mudança entre a LP C v1 e a LP B v1 é o nome (comentários do HTML e do CSS) e o `utm_content` dos CTAs, que passou de `lp_c` para `lp_b_upgrade`. Copy, layout e efeitos são os mesmos.

## 1. Objetivo e público

**Objetivo.** Levar advogados que já têm o Starter ativo, grátis pela parceria entre a Forlex e a OAB, a fazer o upgrade para o Premium. Diretriz do João: "direcionar o lead a benefícios que ele ainda não tem e terá no plano Premium." A página mostra o que a pessoa tem hoje no Starter, o que ganha no Premium (mais ACUs, documentos, Vault e casos com a LIVIA, fluxos e integrações) e a condição de 30% off em parceria com a OAB.

**Público.** Usuários atuais: advogados com inscrição ativa na OAB, de qualquer seccional, que já criaram a conta e usam o Starter pela parceria. Não é uma página para quem ainda não tem conta (para esse público, ver LP A em forlex.ai/advogados).

**Ação principal.** Clicar em um dos CTAs, entrar com a conta que já usa e escolher o Premium na página de planos do app.

## 2. URL da página e destino dos CTAs

* **URL de publicação:** `https://forlex.ai/upgrade-premium`
* Arquivo da página: `LP_B_upgrade_v1.html` (HTML único, autossuficiente, com fontes e imagens embutidas em base64, cerca de 680 KB).
* Destino de todos os CTAs (6 links): `https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_b_upgrade`
* UTMs: `utm_source=meta`, `utm_medium=paid_social`, `utm_campaign=convenio_oab`, `utm_content=lp_b_upgrade`. As três primeiras são as mesmas da LP A; só o `utm_content` muda (LP A usa `lp_a`).
* Conferido no arquivo em 01/10/2026: os 6 links para o app usam exatamente essa URL e nenhum outro link aponta para o app.

| # | CTA (texto do botão) | Bloco | Destino |
|:--|:--|:--|:--|
| 1 | Fazer upgrade | 01 Header | login + UTMs `lp_b_upgrade` |
| 2 | Fazer upgrade para o Premium | 02 Hero | login + UTMs `lp_b_upgrade` |
| 3 | Fazer upgrade para o Premium | 03 Comparativo Starter x Premium | login + UTMs `lp_b_upgrade` |
| 4 | Fazer upgrade para o Premium | 04 Benefícios do Premium | login + UTMs `lp_b_upgrade` |
| 5 | Fazer upgrade para o Premium | 07 Oferta | login + UTMs `lp_b_upgrade` |
| 6 | Fazer upgrade para o Premium | 09 CTA final | login + UTMs `lp_b_upgrade` |

Outros links da página: `https://www.forlex.ai/oab` (rodapé), `https://www.forlex.ai/security`, `https://www.forlex.ai/terms` e as âncoras internas `#comparativo` (2 links: pill do hero e "Comparar Starter e Premium"), `#oferta` ("Ver o preço do Premium") e `#topo` (logo do header).

Ponto de atenção: o destino é a tela de login, não a página de planos. A microcopy e o FAQ dizem que a pessoa entra com a mesma conta e escolhe o Premium na página de planos do app. Esse caminho ainda não foi testado (ver seção 11).

## 3. Ordem das seções e estrutura bloco a bloco

Ordem: 01 Header, 02 Hero, 03 Comparativo Starter x Premium, 04 Benefícios do Premium, 05 Confiança, 06 Prova, 07 Oferta, 08 FAQ, 09 CTA final, 10 Rodapé.

Cada bloco tem o atributo `data-figma` no HTML com o nome abaixo. Desktop: largura 1440, conteúdo em `.wrap` (máximo 1440, padding lateral 120). Tablet (até 1239 px): padding 48. Mobile (até 767 px, frame de referência 390): padding 24. Mesma grade da LP A.

### 01 Header
* **Função:** marca e CTA sempre visíveis.
* **Copy:** logo Forlex e botão "Fazer upgrade".
* **Componentes:** logo SVG, botão pequeno `.btn--sm`.
* **Desktop x mobile:** fixo no topo (`position: sticky`), 72 px de altura no desktop e 64 px no mobile, fundo translúcido com blur, sobreposto ao hero. Igual ao header da LP A.

### 02 Hero
* **Função:** falar direto com quem já usa o Starter e mostrar o que o Premium libera.
* **Copy:** pill "Para quem já usa o Starter pela parceria com a OAB" (link para o comparativo). H1 "Você já usa o Starter. / Veja o que o Premium libera." (segunda linha com gradiente). Lead com "30% off em parceria com a OAB" em destaque. 4 itens do que o Premium dá. CTA "Fazer upgrade para o Premium", microcopy, links "Comparar Starter e Premium" e "Ver o preço do Premium", nota legal. Print da tela inicial da LIVIA.
* **Componentes:** pill, H1 com gradiente (sem rotação de marca, ao contrário da LP A), lista `.hcan` com 4 itens e ícone, botão grande, links de texto, print em moldura de vidro (`.glass`), glow e aurora ao fundo.
* **Desktop x mobile:** desktop com tudo centralizado, H1 em 2 linhas (linha do gradiente com largura máxima de 980 px, `text-wrap: balance`) e os 4 itens em 2 colunas. Mobile com itens em 1 coluna, botão em largura total e links empilhados.

### 03 Comparativo Starter x Premium
* **Função:** núcleo da página. Mostrar lado a lado o que a pessoa tem hoje e o que ganha.
* **Copy:** eyebrow "Starter x Premium". H2 "O que você tem hoje e o que ganha no Premium". 9 linhas em 3 grupos (Uso de IA, No seu trabalho, Na conta). Nota sobre ACU, CTA e nota legal.
* **Componentes:** tabela de 3 colunas (`.ctable`, `role="table"`), coluna Starter apagada e coluna Premium em destaque com selo "30% off em parceria com a OAB", cabeçalho fixo (sticky a 72 px), ícones de sim, parcial e não.
* **Desktop x mobile:** desktop com a tabela (colunas 26%, 34% e 40%; no tablet 24%, 34% e 42%). No mobile (até 767 px) a tabela some e entram 9 cards (`.cmpcard`), um por linha: primeiro a caixa destacada "Premium" e depois a linha apagada "Starter (hoje)". A legenda acima dos cards também vem com o Premium primeiro.

### 04 Benefícios do Premium
* **Função:** explicar cada liberação com casos de uso do dia a dia.
* **Copy:** eyebrow "O que o Premium libera". H2 "O que muda no seu dia de trabalho com o Premium". 3 linhas numeradas: 1 Mais capacidade de IA (10 ACUs); 2 Documentos, Vault e casos; 3 Fluxos e integrações. Cada uma com lista "No dia a dia" de 3 exemplos. Nota sobre WhatsApp na linha 3. CTA e nota legal.
* **Componentes:** linhas alternadas texto e arte (`.step`, a linha 2 invertida), lista `.uses` com check. Arte 1: print real da petição com o painel Workspace e a legislação citada. Arte 2: mockup em código do Vault com Perguntar à LIVIA. Arte 3: mockup em código de fluxo Documento, LIVIA, Sua revisão, com luz animada nas linhas.
* **Desktop x mobile:** texto e arte lado a lado no desktop; empilhados no mobile. Título da linha (`.zh`) 30/38 px no desktop, 26/34 px até 900 px e 22/30 px no mobile.

### 05 Confiança
* **Função:** lembrar que mais ACUs valem a pena porque a LIVIA mostra a fonte.
* **Copy:** eyebrow "Confiança". H2 "Mais ACUs para uma IA que mostra a fonte". Texto sobre IAs de uso geral, logos de ChatGPT, Claude e Gemini, destaque "Taxa de alucinação da LIVIA: menor que 5%", painel "O que os estudos medem" (Stanford RegLab 17% a 33%; AA-Omniscience: Claude Opus 5.5 58,6%, GPT-6 Astra 51,3%, Gemini 4 Argon 15,1%) com fontes, print da resposta com jurisprudência, chamada "A LIVIA mostra a fonte...", card do TST (10/03/2026).
* **Componentes:** mesmo bloco de alucinação da LP A v4.4, encurtado (sem as três dores). Card de taxa, gráficos de barras, print em moldura, card de chamada, card TST.
* **Desktop x mobile:** título e texto em 2 colunas e gráficos lado a lado no desktop; tudo em 1 coluna no mobile.

### 06 Prova
* **Função:** prova social com fatos públicos.
* **Copy:** "A Forlex em fatos públicos". +120.000 usuários, +7.000 usuários corporativos, 9 países, "Parceira da OAB Nacional" com o logo. "Relacionamentos selecionados:" com logos Natura, Qatar Airways, Felipe Sarmento Advogados e AWS. Nota de fontes.
* **Componentes:** mesmo bloco 03 Prova da LP A (faixa de 4 estatísticas com contadores animados, logos em monocromia).
* **Desktop x mobile:** 4 colunas no desktop, 2 x 2 no tablet e mobile.

### 07 Oferta
* **Função:** apresentar o Premium e converter.
* **Copy:** eyebrow "Premium em parceria com a OAB". H2 "Faça o upgrade para o Premium com 30% off". Card Forlex Premium com selo "Parceria OAB: 30% off", R$ 209,90/mês, "30% off em parceria com a OAB", 5 itens, CTA. Nota "Prefere ficar no Starter?". 4 notas (fidelidade, ACU, WhatsApp, seccionais).
* **Componentes:** um card só (`.plans--one`, máximo 560 px), escuro com glow (`.plan.hl`), nota `.stnote` com ícone.
* **Desktop x mobile:** card centralizado no desktop; largura total no mobile.

### 08 FAQ
* **Função:** responder dúvidas de quem vai trocar de plano.
* **Copy:** eyebrow "Dúvidas sobre o upgrade". H2 "Perguntas frequentes". 8 perguntas (ver seção 4).
* **Componentes:** acordeão nativo (`details`/`summary`), primeira pergunta aberta.
* **Desktop x mobile:** título fixo à esquerda (sticky) e perguntas à direita no desktop; empilhado no tablet e mobile.

### 09 CTA final
* **Função:** fechamento e último CTA.
* **Copy:** "Mais capacidade para o trabalho que você já faz com a LIVIA." CTA e nota legal.
* **Componentes:** faixa escura arredondada (`.band`) com gradientes e grade.
* **Desktop x mobile:** H2 de 60 px no desktop e 34 px no mobile; botão em largura total no mobile.

### 10 Rodapé
* **Função:** links institucionais e textos legais.
* **Copy:** links Benefícios OAB, Segurança, Termos de Uso e Política de Privacidade; notas legais; aviso de marcas; © 2026 Forlex Ltda. CNPJ 49.118.347/0001-22.
* **Desktop x mobile:** logo e links na mesma linha no desktop; empilhados no mobile.

## 4. Copy completa por seção

Versão estática, desktop. Logos não aparecem no texto abaixo: estão na faixa de prova (OAB Nacional, Natura, Qatar Airways, F. Sarmento, AWS) e no bloco de confiança (ChatGPT, Claude, Gemini), com texto alternativo.

### 01 Header
* Botão: Fazer upgrade

### 02 Hero
* Pill: Para quem já usa o Starter pela parceria com a OAB
* H1: Você já usa o Starter. Veja o que o Premium libera.
* Lead: O Starter colocou a LIVIA no seu dia de trabalho. No Forlex Premium, com 30% off em parceria com a OAB, você ganha:
* Item: 10 ACUs por mês para usar a IA, em vez de 2
* Item: Documentos, Vault e casos com a LIVIA
* Item: Fluxos com a LIVIA, com etapas e revisão humana
* Item: Integrações e conexões com ferramentas selecionadas
* CTA: Fazer upgrade para o Premium
* Microcopy: Entre com a conta que você já usa e escolha o Premium na página de planos do app.
* Links: Comparar Starter e Premium | Ver o preço do Premium
* Nota legal: Premium com 30% off em parceria com a OAB, conforme os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar.
* Barra do print: app.forlex.ai

### 03 Comparativo Starter x Premium
* Eyebrow: Starter x Premium
* H2: O que você tem hoje e o que ganha no Premium
* Lead: Você continua com tudo o que já usa no Starter. O Premium soma mais ACUs, documentos, Vault e casos com a LIVIA, fluxos e integrações.
* Cabeçalho: O que muda | O QUE VOCÊ TEM HOJE: Starter, Grátis em parceria com a OAB | O QUE VOCÊ GANHA: Premium, 30% off em parceria com a OAB

| Grupo | Item | Starter (hoje) | Premium |
|:--|:--|:--|:--|
| Uso de IA | ACUs por mês | 2 ACUs por mês | 10 ACUs por mês |
| Uso de IA | Indicado para | Começar com a LIVIA, documentos e o trabalho profissional diário | Mais capacidade para análise documental, pesquisa jurídica e redação fundamentada |
| No seu trabalho | Documentos, Vault e casos | Documentos, Vault e contexto de casos, em versão limitada | Documentos, Vault e casos com a LIVIA |
| No seu trabalho | Fluxos com a LIVIA | Não fazem parte do Starter | Incluídos no Premium |
| No seu trabalho | Integrações | Não fazem parte do Starter | Integrações e conexões com ferramentas selecionadas |
| Na conta | Assistente LIVIA e ambiente central | Incluídos | Incluídos |
| Na conta | Usuários | 1 usuário | 1 usuário |
| Na conta | Suporte | Suporte padrão | Suporte padrão |
| Na conta | Preço | R$ 89,90/mês, grátis em parceria com a OAB | R$ 209,90/mês, com 30% off em parceria com a OAB |

* Nota: ACU (Unidade Computacional do Agente) mede o uso de IA na plataforma e varia conforme a complexidade de cada tarefa.
* CTA: Fazer upgrade para o Premium
* Nota legal: Premium com 30% off em parceria com a OAB, conforme os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar.

### 04 Benefícios do Premium
* Eyebrow: O que o Premium libera
* H2: O que muda no seu dia de trabalho com o Premium
* Lead: Três liberações que você ainda não tem no Starter, com exemplos do dia a dia de quem advoga.

**1. Mais capacidade de IA**

* Título: 10 ACUs por mês para pesquisar, analisar e redigir
* Texto: No Starter, você tem 2 ACUs por mês. No Premium, são 10. A ACU mede o uso de IA na plataforma e varia conforme a complexidade da tarefa. Com mais ACUs, sobra espaço para o trabalho que pede a LIVIA a fundo.
* No dia a dia: Pesquisar jurisprudência e legislação para uma petição, com as fontes separadas no Workspace
* No dia a dia: Analisar o contrato ou os documentos que o cliente mandou antes da reunião
* No dia a dia: Redigir uma peça fundamentada, como uma petição inicial, e revisar antes de assinar

**2. Documentos, Vault e casos**

* Título: Os documentos do escritório trabalhando com a LIVIA
* Texto: No Starter, documentos, Vault e contexto de casos vêm em versão limitada. No Premium, documentos, Vault e casos entram no plano com a LIVIA. Organize contratos, petições e anexos por cliente, tema ou projeto e use Perguntar à LIVIA dentro do Vault para receber a resposta com os documentos de referência indicados.
* No dia a dia: Perguntar quais contratos de um cliente têm multa por rescisão
* No dia a dia: Reunir petições e anexos de um caso para preparar uma audiência
* No dia a dia: Partir dos documentos do Vault ao criar um documento com a LIVIA

**3. Fluxos e integrações**

* Título: Fluxos com a LIVIA e conexão com as suas ferramentas
* Texto: Dois recursos que o Premium inclui e o Starter não lista. Nos fluxos, a LIVIA trabalha em etapas configuradas, com responsáveis, revisão humana e aprovações rastreadas. As integrações conectam a Forlex a ferramentas selecionadas do seu dia a dia.
* No dia a dia: Padronizar a revisão de contratos com uma etapa de aprovação antes do envio ao cliente
* No dia a dia: Organizar a triagem dos documentos que chegam, com a sua revisão no final
* No dia a dia: Conectar a Forlex a ferramentas selecionadas que você já usa
* Nota: Fluxos de comunicação, como WhatsApp, exigem configuração de provedor e podem ter custos adicionais cobrados separadamente do plano.

**Fechamento do bloco**

* CTA: Fazer upgrade para o Premium
* Nota legal: Premium com 30% off em parceria com a OAB, conforme os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar.

### 05 Confiança
* Eyebrow: Confiança
* H2: Mais ACUs para uma IA que mostra a fonte
* Lead: ChatGPT, Claude e Gemini são IAs de uso geral, feitas para responder sobre qualquer assunto. A LIVIA foi desenvolvida pela Forlex para o trabalho jurídico.
* Destaque: Taxa de alucinação da LIVIA: menor que 5%
* Painel: O que os estudos medem. Taxa de alucinação de outros modelos em 2 estudos diferentes.
* Gráfico 1: Pesquisa jurídica com IA. Consultas jurídicas com alucinação na resposta. Ferramentas de IA jurídica avaliadas pelo Stanford RegLab, três ferramentas comerciais dos EUA: 17% a 33%.
* Fonte 1: e-book Forlex "A alucinação que a IA generalista esconde" (v1.5, maio de 2026), adaptado de Daniel Bichuetti e Heitor Marques (2026), cap. 3, p. 18. Faixa de 17% a 33%: Magesh et al., Stanford RegLab (2024/2025).
* Gráfico 2: Modelos de uso geral no AA-Omniscience. Das perguntas que o modelo não acertou, quantas ele respondeu errado em vez de dizer que não sabia. Claude Opus 5.5 (Anthropic) 58,6%; GPT-6 Astra (OpenAI) 51,3%; Gemini 4 Argon (Google) 15,1%.
* Fonte 2: Artificial Analysis, AA-Omniscience (6.000 perguntas em 42 temas de 6 áreas), artificialanalysis.ai/evaluations/omniscience, acesso em 01/10/2026. Modelo de cada empresa com maior Artificial Analysis Intelligence Index (v4.3.2) entre os exibidos na página: Claude Opus 5.5 (Adaptive Reasoning, Max Effort), GPT-6 Astra (Max), Gemini 4 Argon (High).
* Chamada: A LIVIA mostra a fonte para você conferir e, quando falta base, mostra a lacuna em vez de simular certeza.
* Card TST: Quem assina a peça responde por ela. Em 10/03/2026, a 6ª Turma do TST condenou uma empresa e o advogado a pagar multa por citações falsas de jurisprudência, em um caso de possível uso de IA. Fonte: Tribunal Superior do Trabalho (tst.jus.br), decisão de 10/03/2026.

### 06 Prova
* Título: A Forlex em fatos públicos
* Números: +120.000 usuários | +7.000 usuários corporativos | 9 países com profissionais usando a Forlex | Parceira da OAB Nacional
* Relacionamentos selecionados: (logos)
* Nota: Usuários e usuários corporativos: dados da Forlex. Países: forlex.ai, revisado em maio de 2026. Relacionamentos conforme forlex.ai/customers.

### 07 Oferta
* Eyebrow: Premium em parceria com a OAB
* H2: Faça o upgrade para o Premium com 30% off
* Lead: Mesma conta, mesma LIVIA, mais capacidade. O desconto vem da parceria entre a Forlex e a OAB.
* Card: selo "Parceria OAB: 30% off". Forlex Premium. Para quem precisa de mais capacidade para análise documental, pesquisa jurídica e redação fundamentada. R$ 209,90/mês. 30% off em parceria com a OAB.
* Itens: 1 usuário | 10 ACUs por mês | Documentos, Vault, casos e fluxos com a LIVIA | Integrações e conexões com ferramentas selecionadas | Suporte padrão
* CTA: Fazer upgrade para o Premium
* Nota: Prefere ficar no Starter? O Starter continua disponível para advogados com inscrição ativa na OAB, conforme os termos da parceria.
* Notas: Sem fidelidade, cancele quando quiser. | ACU (Unidade Computacional do Agente) mede o uso de IA na plataforma e varia conforme a complexidade de cada tarefa. | Fluxos de comunicação, como WhatsApp, exigem configuração de provedor e podem ter custos adicionais cobrados separadamente do plano. | Se a sua seccional tem convênio próprio, as condições e o código de benefício estão em forlex.ai/oab. Benefícios e condições seguem os termos da parceria e podem mudar conforme as regras aplicáveis.

### 08 FAQ
* Eyebrow: Dúvidas sobre o upgrade
* H2: Perguntas frequentes
* **Como faço o upgrade?** Pelo botão desta página. Entre com a conta que você já usa e escolha o Premium na página de planos do app. Você não precisa criar outra conta.
* **O que acontece com os meus documentos?** O upgrade acontece na mesma conta, então você continua trabalhando no mesmo ambiente da LIVIA. Se tiver alguma dúvida sobre a sua conta antes de trocar de plano, fale com o suporte da Forlex.
* **Preciso do Premium para continuar usando a LIVIA?** Não. O Starter continua disponível para advogados com inscrição ativa na OAB, conforme os termos da parceria. O Premium é para quem precisa de mais capacidade.
* **Posso cancelar o Premium?** Sim. Sem fidelidade, cancele quando quiser. O Starter continua disponível para advogados com inscrição ativa na OAB, conforme os termos da parceria.
* **Como funciona o desconto de 30%?** O Premium tem 30% off em parceria com a OAB sobre o preço de R$ 209,90/mês. Se a sua seccional tem convênio próprio, o código de benefício está em forlex.ai/oab e deve ser informado na contratação.
* **Por quanto tempo vale o desconto?** A validade segue os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar conforme as regras aplicáveis.
* **O que é ACU?** ACU (Unidade Computacional do Agente) é o indicador que mede o uso de IA na plataforma e varia conforme a complexidade de cada tarefa. No Starter são 2 ACUs por mês. No Premium, 10.
* **O Premium libera mais usuários?** Não. O Premium é para 1 usuário, como o Starter. Para equipes, a Forlex tem o plano Enterprise, com o escopo definido junto com a equipe.

### 09 CTA final
* H2: Mais capacidade para o trabalho que você já faz com a LIVIA.
* Lead: Entre com a sua conta e faça o upgrade para o Premium com 30% off em parceria com a OAB.
* CTA: Fazer upgrade para o Premium
* Nota legal: Premium com 30% off em parceria com a OAB, conforme os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar.

### 10 Rodapé
* Links: Benefícios OAB | Segurança | Termos de Uso e Política de Privacidade
* Legal: Premium com 30% off em parceria com a OAB, conforme os termos da parceria e dos convênios com as seccionais. As condições comerciais podem mudar. O Starter continua disponível para advogados com inscrição ativa na OAB, conforme os termos da parceria.
* Legal: Convênios próprios com 13 seccionais participantes da OAB, conforme forlex.ai/oab.
* Legal: ChatGPT, Claude e Gemini são marcas de seus respectivos titulares (OpenAI, Anthropic e Google), citadas apenas para comparação.
* © 2026 Forlex Ltda. CNPJ 49.118.347/0001-22. Todos os direitos reservados.

**Meta title:** Forlex Premium com 30% off em parceria com a OAB | Para quem já usa o Starter

**Meta description:** Você já usa o Starter. No Forlex Premium, com 30% off em parceria com a OAB, você ganha 10 ACUs por mês, documentos, Vault e casos com a LIVIA, fluxos e integrações com ferramentas selecionadas.

## 5. Comparativo Starter x Premium: fatos e fontes

| Item | Starter (hoje) | Premium | Fonte |
|:--|:--|:--|:--|
| Preço de tabela | R$ 89,90/mês | R$ 209,90/mês | forlex.ai/plans (consulta em 01/10/2026) |
| Condição OAB | "Parceria OAB, 100% OFF" (grátis) | "Parceria OAB, 30% OFF" | forlex.ai/plans; LP A v4.4 ("30% off em parceria com a OAB") |
| ACUs por mês | 2 | 10 | Premium: forlex.ai/plans, LP A v4.4, LP B v2. Starter: LP A v4.4 e LP B v2 aprovadas e nota da base institucional sobre o teto de 2 ACUs a partir de 01/10. O site ainda mostra 5 (ver seção 11) |
| Usuários | 1 | 1 | forlex.ai/plans |
| Documentos, Vault e casos | "Documentos, cofres e contexto de casos (limitado)" | "Documentos, cofres, casos e fluxos com LIVIA" | forlex.ai/plans |
| Fluxos com a LIVIA | não listado | listado | forlex.ai/plans |
| Integrações | não listado | "Integrações e conexões de ferramentas selecionadas" | forlex.ai/plans |
| Assistente LIVIA e ambiente central | listado | não listado no card do Premium (tratado como incluído por ser plano superior) | forlex.ai/plans |
| Suporte | Padrão | Padrão | forlex.ai/plans |
| Indicado para | "Para profissionais começando com LIVIA, documentos e trabalho profissional diário." | "Para profissionais que precisam de mais capacidade para análise documental, pesquisa jurídica e redação fundamentada." | forlex.ai/plans |
| Fidelidade | "Sem fidelidade, cancele quando quiser" | idem | forlex.ai/plans |
| ACU | "Unidade Computacional do Agente", mede o uso de IA e varia conforme a complexidade da tarefa | idem | forlex.ai/plans (nota ***) |
| WhatsApp e fluxos de comunicação | exigem configuração de provedor e podem ter custos adicionais cobrados à parte | idem | forlex.ai/plans (nota ****) |
| Cupons das seccionais | 13 seccionais, códigos OAB{UF}FREE (Starter) e OAB{UF}30 (desconto) | idem | forlex.ai/oab |
| Validade do benefício | segue o convênio, condições comerciais podem mudar | idem | forlex.ai/oab (FAQ) |

Base institucional usada: `/workspace/copy-studio/forlex_base_institucional.md` (planos, seção 13.10 sobre ACUs do Starter, códigos das seccionais).

## 6. Design tokens

Paleta, tipografia, espaçamento, raios, sombras e botões são os mesmos da LP A v4.4 (seção 4 da documentação da LP A). A LP B usa o mesmo CSS da LP A (`lp_a_v3.css` a `lp_a_v4_3_1.css`) mais um delta próprio em `lp_mockups/_build/lp_c_v1.css`:

* Hero: linha do gradiente do H1 com largura máxima de 980 px e `text-wrap: balance`; destaque em negrito no lead (#FAFAFA, 600).
* Comparativo: coluna Starter com texto rgba(192,212,224,.58) e fundo rgba(9,25,32,.28); coluna Premium em destaque; selo `.hbadge` (altura 26, raio 999, fundo #598FB2, Sora 600 12/16); nomes dos planos Sora 24/30.
* Cards do comparativo no mobile: rótulo "Premium" com selo `.pbadge` (altura 20, fundo #598FB2) e rótulo "Starter (hoje)" apagado.
* Benefícios: título da linha 30/38 px; lista `.uses` com check em tile #EFF4F7; rótulo "No dia a dia" Sora 500 12/16 em caixa alta.
* Oferta: um card só (`.plans--one`, máximo 560 px) e nota `.stnote` (raio 20, borda clara, fundo #FAFAFA).

## 7. Comportamento responsivo

* Breakpoints usados: 1239, 900, 767, 640 e 479 px (os mesmos da LP A). Frames de referência: 1440 (desktop) e 390 (mobile).
* **Comparativo no mobile:** até 767 px a tabela é escondida e entram 9 cards, um por linha da tabela. Em cada card vem primeiro a caixa destacada "Premium" e depois a linha apagada "Starter (hoje)". A legenda acima dos cards também mostra o Premium primeiro. No desktop a ordem das colunas é Starter e depois Premium.
* Benefícios: texto e arte lado a lado no desktop (linha 2 invertida); empilhados no mobile.
* Hero: lista dos 4 itens em 1 coluna, botão em largura total e links empilhados no mobile.
* Prova: 4 colunas no desktop, 2 x 2 no tablet e mobile.
* FAQ: título sticky à esquerda no desktop; empilhado abaixo de 1239 px.
* Botões primários em largura total no mobile (exceto o pequeno do header).
* Sem rolagem horizontal em 390 px e 1440 px (verificado no QA, `qa_lp_c_v1_report.json`, ALL_OK).

## 8. Efeitos

Mesmo sistema da LP A v4.4 (seção 5 da documentação da LP A), com estas diferenças:

* **Sem rotação de marca no H1.** O H1 da LP B é fixo. O parâmetro `?brands=0` não tem efeito nesta página.
* `?static=1`: página sem nenhuma animação, tudo no estado final (para prints e revisão).
* Com `prefers-reduced-motion: reduce`, a classe `.fx` não entra (nada fica escondido) e o CSS zera animações e transições.
* Sem JavaScript, todo o conteúdo aparece completo.
* Revelação ao rolar (`IntersectionObserver`, threshold .12, 0,9 s), com o seletor estendido para `.step`, `.stnote` e `.cmpnote`; escalonamento de 80 ms entre irmãos.
* Contadores +120.000 e +7.000 no bloco 06 (1,6 s, formato pt-BR).
* Barras dos gráficos do bloco 05 crescem da esquerda; barra da Forlex com brilho pulsante.
* Glow e aurora no hero, glow atrás do print.
* Luz percorrendo as linhas do fluxo Documento, LIVIA, Sua revisão (benefício 3).
* Hovers de cards e botões iguais aos da LP A.
* Rolagem suave para âncoras com `scroll-padding-top: 88px` (por causa do header fixo). Cabeçalho da tabela do comparativo e título do FAQ ficam sticky no desktop.

## 9. Assets embutidos

| Asset | Onde aparece | Origem |
|:--|:--|:--|
| Logo Forlex (SVG) | header, rodapé | design system Forlex (`_build/common.py`) |
| Print da tela inicial da LIVIA (JPEG 1240x700) | 02 Hero | print real do app, mesmo da LP A v4.4 |
| Print da petição com o painel Workspace e a legislação citada (JPEG 1200x528) | 04 Benefícios, linha 1 | print real, `01_livia_legislacao_fonte.png`, recorte sem barra lateral |
| Mockup do Vault com Perguntar à LIVIA | 04 Benefícios, linha 2 | ilustração em HTML e CSS (não é print) |
| Mockup do fluxo Documento, LIVIA, Sua revisão | 04 Benefícios, linha 3 | ilustração em HTML e CSS (não é print) |
| Print da resposta com jurisprudência (JPEG 860x664) | 05 Confiança | print real, `01_livia_jurisprudencia_fonte.png`, mesmo recorte da LP A v4.4 |
| Logos de ChatGPT, Claude e Gemini | 05 Confiança | ícones em SVG embutidos |
| Logo OAB Nacional | 06 Prova | mesmo arquivo da LP A (s.oab.org.br) |
| Natura, Qatar Airways, Felipe Sarmento Advogados, AWS | 06 Prova | mesmos arquivos da LP A (Wikimedia Commons e site oficial) |
| Fontes Sora e Inter | todo o texto | embutidas em base64 (`@font-face`) |

Prints não usados de propósito: `04_*`, `02_documentos_*`, `03_processos_importacao_oab`, `06_projetos_visao_geral` (mostram nome ou foto do João, ou caso identificável). Os prints do Vault estão vazios, por isso os benefícios 2 e 3 usam mockups.

Imagens por bloco para revisão: `lp_mockups/blocos_lp_c_v1/` (desktop) e `lp_mockups/blocos_lp_c_v1/mobile/`.

## 10. Notas técnicas

* HTML único e autossuficiente: CSS, JS, fontes e imagens embutidos. Nenhuma dependência externa (nenhuma requisição além do próprio HTML, verificado no QA).
* Fontes: Sora (títulos, 500 e 600) e Inter (texto, variável), embutidas.
* `lang="pt-BR"`, meta viewport, `<meta name="robots" content="noindex">` já presente no arquivo (decisão final sobre indexação das LPs pagas é do João), `theme-color` #091920. Não há tags Open Graph no arquivo.
* Header sticky; cabeçalho da tabela e título do FAQ sticky no desktop.
* Script no `head` decide o modo (`html.fx`, `html.static`) antes da página pintar; script no fim do `body` aplica revelações, contadores e gráficos.
* Movimento reduzido respeitado; `?static=1` para revisão.
* Não há formulários na página. Todos os CTAs são links simples para o app.
* Rastreamento (Meta Pixel e PostHog) não está no arquivo: precisa ser adicionado na publicação.

## 11. Pontos a validar antes de publicar

1. **ACUs do Starter:** a página diz 2 ACUs por mês (igual à LP A v4.4). O forlex.ai/plans mostra 5 ACUs no Starter em 01/10/2026. Se o site não for atualizado, quem compara vai ver números diferentes.
2. **Fluxos e integrações "não fazem parte do Starter":** o site não diz isso explicitamente; só não lista esses itens no card do Starter. A tabela trata a ausência como "não faz parte".
3. **Caminho do upgrade via login:** o CTA leva ao login do app. A página promete que a pessoa entra com a mesma conta e escolhe o Premium na página de planos, sem criar outra conta. Esse caminho não foi testado.
4. **Casos de uso ilustrativos:** os exemplos "No dia a dia" (multa por rescisão, audiência, triagem de documentos, revisão de contrato com aprovação) são ilustrativos, montados a partir das funções descritas, não depoimentos. Os visuais dos benefícios 2 e 3 são mockups.
5. **Quem tem os 30% off no Premium:** no site, os valores especiais valem para advogados de seccionais participantes, com o cupom da seccional (OAB{UF}30) informado na contratação. A página diz "30% off em parceria com a OAB", como a LP A, sem dizer que depende do cupom por seccional. Confirmar a redação.
6. **"Documentos, Vault e casos com a LIVIA" no Premium:** o site marca o Starter como "(limitado)" e o Premium não. A página não diz "ilimitado", mas a comparação sugere mais capacidade.
7. **Assistente LIVIA e ambiente central no Premium:** não aparece no card do Premium no site. A página diz "Incluídos" e "Você continua com tudo o que já usa no Starter".
8. **Descrição dos fluxos** ("etapas configuradas, com responsáveis, revisão humana e aprovações rastreadas"): vem da descrição de "Automações e agentes de fluxo" do site. Confirmar se é o mesmo recurso que o card do Premium chama de "fluxos com LIVIA".
9. **Documentos depois do upgrade e Starter depois de cancelar o Premium:** confirmar com produto que nada se perde e como fica a conta ao cancelar.
10. **Enterprise para equipes** (FAQ): confirmar se vale citar na LP.
11. **Bloco de confiança, números e logos:** mesmas afirmações e fontes da LP A v4.4 (taxa da LIVIA menor que 5%, Stanford RegLab, AA-Omniscience, TST 10/03/2026, +120.000, +7.000, 9 países, Parceira da OAB Nacional, logos). Continuam valendo os pontos da LP A: autorização de uso das marcas OAB e dos clientes, regras do CONAR para publicidade comparativa, conferir os números do AA-Omniscience na data da veiculação.

## 12. Itens deixados de fora de propósito

Ficaram fora da página por falta de fonte ou por orientação da spec:

* Tamanho do Vault ou armazenamento e número de documentos.
* Quais módulos (Projetos, Clientes, Cálculos, CLM, Automações, agentes) são exclusivos do Premium.
* Quais integrações entram em cada plano (a base institucional diz que a disponibilidade varia por plano).
* Suporte melhor no Premium (os dois planos têm suporte padrão).
* Preço do Premium com o desconto aplicado (a spec pede para não calcular).
* Se a economia de 17% do plano anual soma com os 30%.
* Rotação de marca no H1 e comparativo com IA genérica (ficam na LP A, que é a página de aquisição).
* Bloco de seccionais com logos (a LP B só cita forlex.ai/oab nas notas).
* Headlines alternativas: "Você já tem a LIVIA. / No Premium, ela faz mais por mês." e "Do Starter ao Premium: mais ACUs, fluxos e integrações." (não usadas; a página usa "Você já usa o Starter. / Veja o que o Premium libera.").

## 13. Acessibilidade

* `lang="pt-BR"`, um único H1, hierarquia H2 e H3 por bloco.
* Tabela do comparativo com `role="table"`, `row`, `columnheader` e `cell`.
* Todas as imagens têm texto alternativo descritivo; mockups decorativos com `aria-hidden`.
* Movimento reduzido respeitado. Sem JavaScript, todo o conteúdo fica visível.
* Foco visível nos botões. FAQ com `details`/`summary` nativo.
* Sem rolagem horizontal em 390 px e 1440 px.

## 14. Onde estão os arquivos

* Página (entrega): `/workspace/copy-studio/entregas/LP_B_upgrade_v1.html`
* Origem (nome de trabalho LP C v1): `lp_mockups/lp_c_v1.html` e `entregas/LP_C_v1.html` (idênticos à LP B, exceto o `utm_content` `lp_c` e os comentários)
* Build: `lp_mockups/_build/build_lp_c_v1.py` (reaproveita `build_a_v4_4.py`); CSS delta `lp_mockups/_build/lp_c_v1.css`; QA `lp_mockups/_build/qa_lp_c_v1.py` e `qa_lp_c_v1_report.json`.
* Copy de origem: `entregas/LP_C_v1_copy.md`
* Imagens por bloco: `lp_mockups/blocos_lp_c_v1/` e `lp_mockups/blocos_lp_c_v1/mobile/`
* Variantes para o Figma (estado final, sem JS, largura fixa): `entregas/figma/LP_B_upgrade_v1_figma_capture_desktop.html` (1440) e `entregas/figma/LP_B_upgrade_v1_figma_capture_mobile.html` (390). Importadas pelo João no arquivo "Forlex Meta Ads OAB v3": https://www.figma.com/design/hIDKP4XKpvDsX507tTfVn8/Forlex-Meta-Ads-OAB-v3
* Esta documentação: `/workspace/copy-studio/entregas/LP_B_upgrade_v1_documentacao.md`
* Documentação da LP A: `/workspace/copy-studio/entregas/LP_A_v4.4_documentacao.md` e https://docs.google.com/document/d/10DMRdJd2Zr3I2RTqT2y_KZ5I_hZKHc4aT-dubcsdOeo/edit
