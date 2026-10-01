# LP A v4.4 Campanha OAB, documentação

Versão: v4.4, de 01/10/2026. Base aprovada: v4.3.1. A única mudança da v4.4 em relação à v4.3.1 é o destino dos CTAs (seção 2). Copy, layout e efeitos são os mesmos da v4.3.1.

## 1. Objetivo e público

**Objetivo.** Levar advogados que chegam pelos anúncios da Meta (campanha do convênio com a OAB) a criar a conta na Forlex e ativar o Starter, que é grátis pela parceria entre a Forlex e a OAB Nacional. A página explica por que a Forlex é diferente de uma IA de uso geral (risco de alucinação, fonte conferível, plataforma de trabalho jurídico completa) e mostra a oferta.

**Público.** Novos usuários: advogados com inscrição ativa na OAB, de qualquer seccional, que ainda não usam a Forlex e muitas vezes já usam ChatGPT, Claude ou Gemini no dia a dia.

**Ação principal.** Clicar em um dos CTAs e chegar à tela de login/cadastro do app.

## 2. URL da página e destino dos CTAs

* **URL de publicação:** `https://forlex.ai/advogados`
* Arquivo da página: `LP_A_v4.4.html` (HTML único, autossuficiente, com fontes e imagens embutidas em base64).
* Destino de todos os CTAs (7 links): `https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_a`
* UTMs mantidas, as mesmas que a LP A já usava: `utm_source=meta`, `utm_medium=paid_social`, `utm_campaign=convenio_oab`, `utm_content=lp_a`.

| # | CTA (texto do botão) | Bloco | Antes (v4.3.1) | Depois (v4.4) |
|:--|:--|:--|:--|:--|
| 1 | Criar conta grátis | 01 Header | `app.forlex.ai/signup?...&plan_tier=starter&...` | `app.forlex.ai/login?utm_...` |
| 2 | Criar minha conta grátis | 02 Hero | signup, plan_tier=starter | login + UTMs |
| 3 | Criar minha conta grátis | 06 Funcionalidades escritório | signup, plan_tier=starter | login + UTMs |
| 4 | Criar minha conta grátis | 07 Comparativo | signup, plan_tier=starter | login + UTMs |
| 5 | Criar conta e ativar o Starter | 09 Oferta | signup, plan_tier=starter | login + UTMs |
| 6 | Criar conta e ver o Premium | 09 Oferta | signup, plan_tier=premium | login + UTMs |
| 7 | Criar minha conta grátis | 12 CTA final | signup, plan_tier=starter | login + UTMs |

URL completa usada antes (v4.3.1), para referência:
`https://app.forlex.ai/signup?partner_code=oab&campaign=oab_starter_activation&landing_page=%2Foab%2Fconvenio&lead_segment=lawyer&sales_motion=oab_partner&plan_tier={starter|premium}&billing_cycle=monthly&locale=pt&language=pt&utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_a`

Ponto de atenção: com o destino único, os parâmetros `partner_code`, `plan_tier` e os demais do signup saem da URL. Os botões do Starter e do Premium agora chegam ao mesmo endereço. Se o time precisar separar os cliques por plano, dá para usar `utm_term=starter` e `utm_term=premium` nos dois botões da Oferta (não aplicado, aguardando decisão).

Links que não mudaram: `https://www.forlex.ai/oab` (2 links: Seccionais e rodapé), `https://www.forlex.ai/security`, `https://www.forlex.ai/terms` e as âncoras internas `#oferta`, `#funcionalidades`, `#comparativo`, `#topo`.

## 3. Estrutura bloco a bloco

Cada bloco tem o atributo `data-figma` no HTML com o nome abaixo. Desktop: largura 1440, conteúdo em `.wrap` (máximo 1440, padding lateral 120). Tablet (até 1239 px): padding 48. Mobile (até 767 px, frame de referência 390): padding 24.

### 01 Header
* **Função:** marca e CTA sempre visíveis.
* **Copy:** logo Forlex e botão "Criar conta grátis".
* **Componentes:** logo SVG (26 px de altura; 22 px no mobile), botão pequeno `.btn--sm`.
* **Desktop x mobile:** fixo no topo (`position: sticky`), 72 px de altura no desktop e 64 px no mobile, fundo rgba(9,25,32,.55) com `backdrop-filter: blur(18px) saturate(140%)` e linha inferior de 1 px. Fica sobreposto ao hero (margin-bottom negativo).

### 02 Hero
* **Função:** promessa principal, prova da parceria e CTA.
* **Copy:** pill "Parceria Forlex e OAB Nacional · para advogados de todo o Brasil". H1 "Seu ChatGPT conversa. A Forlex trabalha em todas as etapas do seu processo." (a marca alterna entre ChatGPT, Claude e Gemini). Lista "Na plataforma LIVIA, você pode:" com 4 itens (criar documentos com IA; importar e acompanhar processos pelo número da OAB ou CNJ; cuidar da gestão do conhecimento do escritório; organizar o trabalho e a gestão dos clientes). Frase "Pela parceria com a OAB, advogados com OAB ativa têm acesso ao Starter gratuitamente." CTA "Criar minha conta grátis", microcopy do cadastro, links "Ver o que a Forlex faz" e "Comparar com a IA genérica", nota legal.
* **Componentes:** pill, H1 com gradiente, grade de 4 cards com ícone, botão grande, links de texto, print real da tela inicial da LIVIA em moldura de vidro (`.glass` + `.bframe`), imagem da carteira da OAB girada -5°, glow e aurora ao fundo, grade sutil e ruído.
* **Desktop x mobile:** desktop com os 4 itens em 2 colunas e H1 em 3 linhas (66 px). Mobile com itens em 1 coluna, H1 de 36 px em 5 linhas, quebra fixa antes de "conversa." (até 479 px) para a rotação não mudar o número de linhas, botão em largura total, links empilhados, carteira menor (150 px).

### 03 Prova
* **Função:** prova social com fatos públicos.
* **Copy:** "A Forlex em fatos públicos". Números +120.000 usuários, +7.000 usuários corporativos, 9 países, "Parceira da OAB Nacional" com o logo. "Relacionamentos selecionados:" com logos Natura, Qatar Airways, Felipe Sarmento Advogados e AWS. Nota de fontes.
* **Componentes:** faixa de 4 estatísticas, contadores animados, logos em monocromia #C0D4E0.
* **Desktop x mobile:** 4 colunas no desktop, 2 x 2 no tablet e mobile. No mobile (até 640 px) os logos ficam numa linha só, com alturas menores.

### 04 Risco de alucinação
* **Função:** mostrar o problema das IAs de uso geral e a resposta da LIVIA.
* **Copy:** "O risco de alucinação". H2 "Já recebeu uma resposta da IA e perguntou: será que esse julgado existe mesmo?" Texto sobre ChatGPT, Claude e Gemini serem IAs de uso geral e a LIVIA ser desenvolvida para o trabalho jurídico. Três dores ("A jurisprudência não existe", "O número do processo está errado", "O raciocínio não fecha"). Destaque "Taxa de alucinação da LIVIA: menor que 5%". Painel "O que os estudos medem" com 2 estudos (Stanford RegLab 17% a 33%; AA-Omniscience: Claude Opus 5.5 58,6%, GPT-6 Astra 51,3%, Gemini 4 Argon 15,1%) e fontes. Print da resposta da LIVIA com jurisprudência, chamada "A LIVIA mostra a fonte...", card do TST (10/03/2026).
* **Componentes:** logos das IAs, 3 cards de dor, card de taxa (`.lvrate`), painel escuro com gráfico de barras (`.viz`, `.vpanel`, `.bar`), print em moldura, card de chamada (`.lvcall`), card TST (`.tst`).
* **Desktop x mobile:** dores em 3 colunas e gráficos lado a lado no desktop; tudo em 1 coluna no mobile, card de taxa empilhado (até 900 px), título do gráfico em 22 px.

### 05 Funcionalidades
* **Função:** mostrar que a Forlex é uma ferramenta para todas as etapas do trabalho.
* **Copy:** "O que a Forlex faz". H2 "Uma ferramenta para todas as etapas do seu trabalho, não só para tirar dúvidas num chat." Texto sobre a LIVIA e o processo. Print da lista de Processos. Faixa com 19 recursos (Processos, Nova importação pela OAB, Monitoramento, Peças do tribunal, Gerar resumo, Pergunte à LIVIA, Pesquisador de jurisprudência, Analista de documentos, Documentos, Criar com a LIVIA, Vault, CLM, e-Sign, Projetos, Kanban, Agenda, Clientes, Automações, Pesquisar).
* **Componentes:** bloco de título central, print em moldura, marquee de chips (a lista aparece 2 vezes no HTML para o loop).
* **Desktop x mobile:** igual nos dois, com chips de 40 px no mobile e título alinhado à esquerda.

### 06 Funcionalidades escritório
* **Função:** mostrar o resto do escritório (conhecimento, trabalho, clientes, contratos, automações, busca).
* **Copy:** "E o resto do escritório". H2 "Conhecimento, trabalho e clientes no mesmo lugar". Cards: Vault (gestão do conhecimento), Projetos (gestão do trabalho, Kanban com CNJ, Agenda), Clientes (cadastro, Configurações da LIVIA, Cálculos jurídicos, Rascunho da IA), CLM (triagem, playbook, redline, e-Sign), Automações (modelos, por evento, Caixa de entrada), Pesquisar. CTA "Criar minha conta grátis" e nota legal.
* **Componentes:** 3 cards pilares com ilustração de interface em código (`.pcard`, `.bviz`), bento com cards largos, fluxo animado Processo, LIVIA, Caixa de entrada (`.wire`), chips de recursos.
* **Desktop x mobile:** 3 colunas no desktop (2 no tablet), 1 coluna no mobile.

### 07 Comparativo
* **Função:** comparar IA genérica e Forlex tarefa por tarefa.
* **Copy:** "Comparativo". H2 "IA genérica x Forlex: o chat é só uma linha desta tabela". 16 linhas em 4 grupos (Na conversa, No processo, No escritório, Na conta). Última linha: custo para advogado com inscrição ativa na OAB (Starter grátis pela parceria). CTA e nota legal.
* **Componentes:** tabela de 3 colunas com cabeçalho fixo (sticky a 72 px) e coluna Forlex destacada; ícones de check; logos das IAs.
* **Desktop x mobile:** desktop com a tabela. No mobile a tabela some e entram cards por linha (`.cmpcard`): primeiro a resposta da Forlex (logo de 12 px de altura) e depois "IA" com os 3 logos; legenda com logo Forlex de 18 px.

### 08 Segurança
* **Função:** tranquilizar sobre sigilo e dados de clientes.
* **Copy:** "Segurança e sigilo". H2 "Seu trabalho e os dados dos seus clientes sob controle". 3 cards: Alinhada à LGPD; Acesso controlado; Você decide.
* **Componentes:** 3 cards escuros com ícone (`.gcard`).
* **Desktop x mobile:** 3 colunas no desktop; 1 coluna no mobile, com ícone ao lado do título.

### 09 Oferta
* **Função:** apresentar os planos e converter.
* **Copy:** "Parceria Forlex e OAB Nacional". H2 "Advogados com inscrição ativa na OAB têm acesso ao Starter grátis, seja qual for a seccional". Texto com o OpenDetector. Starter (destaque): selo "Parceria OAB: 100% off", R$ 89,90/mês, "Grátis em parceria com a OAB", 1 usuário, 2 ACUs por mês, Assistente LIVIA e ambiente central, Documentos e Vault (limitado), Suporte padrão, CTA "Criar conta e ativar o Starter". Premium: selo "Parceria OAB: 30% off", R$ 209,90/mês, "30% off em parceria com a OAB", 10 ACUs, CTA "Criar conta e ver o Premium". Notas (sem fidelidade, ACU, condições).
* **Componentes:** 2 cards de plano, o Starter escuro com glow (`.plan.hl`), selos, listas com cadeado, botões em largura total.
* **Desktop x mobile:** 2 colunas (máximo 1000 px) no desktop; 1 coluna no mobile, notas à esquerda.

### 10 Seccionais
* **Função:** mostrar as 13 seccionais com convênio próprio sem tirar o foco do benefício nacional.
* **Copy:** "Convênios das seccionais". H2 "Sua seccional tem convênio próprio?" Texto: 13 seccionais, condições em forlex.ai/oab, benefício nacional vale do mesmo jeito. Cards AL, BA, CE, DF, ES, GO, MT, PA, PB, PE, PI, RN, SE. Link "Ver condições e códigos em forlex.ai/oab".
* **Componentes:** cards de 152 px com logo da seccional em monocromia #0F2B38, UF e nome.
* **Desktop x mobile:** linha flexível centralizada no desktop; grade de 2 colunas no mobile.

### 11 FAQ
* **Função:** responder objeções.
* **Copy:** 8 perguntas: Quem pode ativar o Starter grátis? A Forlex é mais um chat de IA? Tudo isso vem no Starter? Por quanto tempo vale o benefício? Como a Forlex encontra os meus processos? A LIVIA substitui a minha revisão? Minha seccional tem convênio próprio. Muda alguma coisa? Como ficam os dados dos meus clientes?
* **Componentes:** acordeão nativo (`details`/`summary`), primeira pergunta aberta, ícone mais/menos.
* **Desktop x mobile:** título fixo à esquerda (380 px, sticky) e perguntas à direita no desktop; empilhado no tablet e mobile.

### 12 CTA final
* **Função:** fechamento e último CTA.
* **Copy:** "Seu dia de advogado não cabe numa janela de chat." "Crie sua conta com o número da OAB e ative o Starter grátis pela parceria entre a Forlex e a OAB Nacional." CTA "Criar minha conta grátis" e nota legal.
* **Componentes:** faixa escura arredondada (`.band`) com gradientes radiais e grade.
* **Desktop x mobile:** H2 de 60 px e padding 120/64 no desktop; H2 de 34 px, padding 64/24 e botão em largura total no mobile.

### 13 Rodapé
* **Função:** links institucionais e textos legais.
* **Copy:** links Benefícios OAB, Segurança, Termos de Uso e Política de Privacidade; nota da parceria; convênios com 13 seccionais; aviso de marcas (ChatGPT, Claude e Gemini são marcas de seus titulares); © 2026 Forlex Ltda. CNPJ 49.118.347/0001-22.
* **Desktop x mobile:** logo e links na mesma linha no desktop; empilhados no mobile.

## 4. Design tokens

### Paleta
| Token CSS | Hex | Uso |
|:--|:--|:--|
| `--c950` | #091920 | fundo escuro principal, texto do botão primário |
| `--c900` | #0B1F28 | fundo escuro alternativo (`.deep`) |
| `--c800` | #0F2B38 | texto em fundo claro, ícones, cards escuros |
| `--blue` | #598FB2 | botão primário (CTA), destaques |
| `--b450` | #719DBA | hover do botão, rótulos de grupo |
| `--b200` | #C0D4E0 | texto em fundo escuro |
| `--gelo` | #EFF4F7 | fundo claro alternativo |
| `--off` | #FAFAFA | fundo claro, títulos em fundo escuro |
| `--lnd` / `--lnd2` | rgba(192,212,224,.12) / .18 | linhas e bordas no escuro |
| `--lnl` | rgba(192,212,224,.95) | linhas e bordas no claro |

Gradiente do H1 (segunda frase): `linear-gradient(90deg,#C0D4E0 0%,#719DBA 21%,#598FB2 50%,#719DBA 79%,#C0D4E0 100%)`, `background-size: 200% 100%`, aplicado com `background-clip: text`.

### Tipografia
* Títulos: **Sora** (500 e 600). Texto: **Inter** (variável 100 a 900). Fontes embutidas no HTML.

| Estilo | Desktop | Mobile (até 767 px) |
|:--|:--|:--|
| H1 hero | Sora 600, 66 px, altura 1.04, espaçamento -0.045em (56 px no tablet) | 36 px, altura 1.08 |
| H2 | Sora 500, 48 px, altura 1.1, -0.035em | 30 px, altura 1.16, -0.03em |
| H2 CTA final (`.h2.xl`) | 60 px, altura 1.04, -0.045em | 34 px, altura 1.1 |
| H3 | Sora 500, 22/28 px, -0.015em | 20/26 px |
| Título de passo (`.zh`) | Sora 500, 32/40 px | 24/31 px |
| Taxa LIVIA (`.lvrate__t`) | Sora 600, 44/52 px | 30/38 px (até 900 px) |
| Lead | Inter 19/30 px | 17/27 px |
| Corpo | Inter 16/26 px | 16/24 px |
| Microcopy | Inter 14/22 px | 13/20 px |
| Legal e notas | Inter 12/18 px | igual |
| Eyebrow (pill) | Sora 500, 13/18 px, altura 30 px | 12/16 px |
| Estatística | Sora 600, 40/44 px | 28/34 px |

### Espaçamento e grid
* Largura máxima 1440, padding lateral 120 (desktop), 48 (tablet, até 1239 px), 24 (mobile).
* Seções: padding vertical 128 px no desktop e 80 px no mobile.
* Espaço entre título e lead: 20 px (16 no mobile). Grades de cards: gap 16 px (12 no mobile). Topo das grades: 56 px (40 no mobile).
* Breakpoints usados: 1239, 900, 767, 640 e 479 px.

### Raios
* Pills e selos: 999 px. Botões: 12 px (grande 14, pequeno 10). Cards: 18 a 24 px (`.bcard`, `.gcard` 24; `.pain`, `.dtile` 20; planos 28; faixa do CTA final 32). Molduras de print: 18 px (14 no mobile). Ícones em tile: 12 px.

### Sombras
* Card claro (`--sh-l`): `0 1px 2px rgba(9,25,32,.04), 0 16px 40px -20px rgba(9,25,32,.12)`.
* Moldura de vidro do hero: `0 60px 140px -30px rgba(9,25,32,.85), 0 24px 48px -24px rgba(9,25,32,.6), inset 0 1px 0 rgba(250,250,250,.10)`.
* Plano em destaque: `0 0 0 5px rgba(89,143,178,.16), 0 40px 80px -28px rgba(9,25,32,.55)`.

### Botões
| Variante | Medidas | Cores | Estados |
|:--|:--|:--|:--|
| Primário `.btn` | altura 48, padding 0 20 0 24, raio 12, Sora 600 15/20, ícone de seta 16 px, gap 10 | fundo #598FB2, texto #091920; sombra `inset 0 1px 0 rgba(250,250,250,.28), 0 0 0 1px rgba(89,143,178,.9), 0 10px 28px -8px rgba(89,143,178,.55)` | hover: fundo #719DBA, sobe 1 px, anel de 6 px rgba(89,143,178,.18) e brilho, faixa de luz atravessa; active: scale(.985); foco: contorno 2 px #C0D4E0 com 3 px de afastamento |
| Grande `.btn--lg` | altura 56, padding 0 24 0 28, raio 14, 16 px | igual | igual |
| Pequeno `.btn--sm` | altura 40, padding 0 14 0 16, raio 10, 14 px, seta 14 | igual | igual |
| Escuro `.btn--dark` | igual ao primário | fundo #091920, texto #FAFAFA | hover fundo #0F2B38 |
| Link de texto `.tlink` | Inter 500 15/24, sublinhado com 4 px de afastamento | #C0D4E0 | hover #FAFAFA |

No mobile o botão primário ocupa a largura total (exceto o pequeno do header).

## 5. Efeitos (especificação para implementação)

### 5.1 Como os efeitos são ligados (classes no `html`)
Um script no `head` decide o modo antes da página pintar:

```js
(function(){var q=new URLSearchParams(location.search),d=document.documentElement;
var st=q.has('static')&&q.get('static')!=='0';
var rm=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var off=q.get('brands')==='0'||window.LP_ROTATE_BRANDS===false;
if(st){d.classList.add('static')}else if(!rm){d.classList.add('fx')}
if(!off&&d.classList.contains('fx')){d.classList.add('brands')}})();
```

* `html.fx`: liga todos os efeitos de entrada e loops. Só entra quando não há `?static=1` e o sistema não pede movimento reduzido.
* `html.brands`: liga a rotação de marcas no H1. Depende de `.fx`.
* `?static=1`: página sem nenhuma animação, tudo no estado final (usado para prints e revisão).
* `?brands=0` ou `window.LP_ROTATE_BRANDS = false`: mantém os outros efeitos e deixa o H1 fixo em "Seu ChatGPT conversa."
* Sem JavaScript, o conteúdo aparece completo (os estados escondidos só existem com `.fx`).
* Curva padrão: `--ease: cubic-bezier(.16,1,.3,1)`.

### 5.2 Rotação de marca no H1 (ChatGPT, Claude, Gemini)
* **Gatilho:** carregamento, depois de `document.fonts.ready`.
* **Ciclo:** troca a cada 2,6 s (`HOLD = 2600`), em loop, pausa enquanto a aba está oculta (`document.hidden`).
* **Animação:** a palavra que sai sobe 0,4em, some e ganha blur de 6 px; a que entra vem de 0,4em abaixo, sem blur, com 0,1 s de atraso. Opacidade e blur em 0,45 s `ease`, deslocamento em 0,6 s `--ease`. A largura do espaço da marca anima em 0,6 s `--ease`, então "conversa." desliza sem pular. Um `clip-path` lateral evita que a palavra que sai invada "conversa." enquanto o espaço encolhe.
* **Ajuste:** recalcula a largura no resize e quando as fontes carregam (sem transição nesse momento).
* **Acessibilidade:** só "ChatGPT" está no HTML; Claude e Gemini são criados pelo JS com `aria-hidden="true"`.
* **Mobile:** até 479 px, "conversa." vai para a linha de baixo sempre (`.h1 .cv{display:block}`), para o número de linhas não mudar.
* **Movimento reduzido:** só a primeira palavra aparece.

```html
<span class="brand" data-brands="ChatGPT|Claude|Gemini"><span class="brand__w is-on">ChatGPT</span></span>
```

```css
.h1 .brand{display:inline-grid;white-space:nowrap;vertical-align:baseline}
.h1 .brand__w{grid-area:1/1;justify-self:start;white-space:nowrap}
.brands .h1 .brand{transition:width .6s var(--ease);clip-path:inset(-.6em -.04em -.6em -.04em)}
.brands .h1 .brand.no-tr{transition:none}
.brands .h1 .brand__w{opacity:0;transform:translate3d(0,.4em,0);filter:blur(6px);
 transition:opacity .45s ease,transform .6s var(--ease),filter .45s ease}
.brands .h1 .brand__w.is-on{opacity:1;transform:none;filter:none;transition-delay:.1s}
.brands .h1 .brand__w.is-out{opacity:0;transform:translate3d(0,-.4em,0);filter:blur(6px);transition-delay:0s}
@media (prefers-reduced-motion: reduce){.h1 .brand__w:not(:first-child){display:none}
 .h1 .brand__w{opacity:1!important;transform:none!important;filter:none!important}}
```

```js
if(d.classList.contains('brands')){var b=document.querySelector('.h1 .brand');if(b){
  var list=b.getAttribute('data-brands').split('|'),ws=[b.querySelector('.brand__w')],k=0,HOLD=2600;
  list.slice(1).forEach(function(w){var s=document.createElement('span');s.className='brand__w';s.textContent=w;
    s.setAttribute('aria-hidden','true');b.appendChild(s);ws.push(s)});
  function fit(){b.style.width=ws[k].offsetWidth+'px'}
  function refit(){b.classList.add('no-tr');fit();void b.offsetWidth;b.classList.remove('no-tr')}
  function go(){var prev=ws[k];k=(k+1)%ws.length;var cur=ws[k];
    prev.classList.remove('is-on');prev.classList.add('is-out');cur.classList.remove('is-out');cur.classList.add('is-on');fit();
    setTimeout(function(){prev.classList.remove('is-out')},800);}
  var ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
  ready.then(function(){refit();window.addEventListener('resize',refit);
    setInterval(function(){if(!document.hidden)go()},HOLD);});
}}
```

### 5.3 Brilho do gradiente do H1
* `.fx .h1 .acc{animation:accShift 9s ease-in-out infinite alternate}`, que move o `background-position` de 0% a 100%.

### 5.4 Revelação ao rolar (scroll reveal)
* **Elementos:** itens do hero, prints, estatísticas, blocos de título, cards (dores, pilares, bento, segurança, planos, seccionais), tabela e cards do comparativo, FAQ, CTA final e rodapé. Lista completa no seletor `SEL` do script.
* **Gatilho:** `IntersectionObserver` com `threshold: .12` e `rootMargin: 0px 0px -6% 0px`; anima uma vez.
* **Animação:** de opacidade 0 e 26 px abaixo para o estado final em 0,9 s `--ease`. No hero: 18 px abaixo com blur de 6 px, em 1 s.
* **Escalonamento:** irmãos entram com 80 ms de diferença (`--d`), no máximo 7 passos (560 ms).

```css
.fx .rv{opacity:0;transform:translate3d(0,26px,0);transition:opacity .9s var(--ease) var(--d,0ms),transform .9s var(--ease) var(--d,0ms)}
.fx .rv.in{opacity:1;transform:none}
.fx .hero__in>.rv{transform:translate3d(0,18px,0);filter:blur(6px);transition:opacity 1s var(--ease) var(--d,0ms),transform 1s var(--ease) var(--d,0ms),filter 1s var(--ease) var(--d,0ms)}
.fx .hero__in>.rv.in{transform:none;filter:none}
```

```js
els.forEach(function(e){e.classList.add('rv');
  var sib=[].filter.call(e.parentElement.children,function(c){return c.matches(SEL)});
  var i=Math.min(sib.indexOf(e),7); e.style.setProperty('--d',(i*80)+'ms');});
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){reveal(x.target);io.unobserve(x.target)}})},
  {threshold:.12,rootMargin:'0px 0px -6% 0px'});
```

### 5.5 Contadores (+120.000 e +7.000)
* **Gatilho:** quando a estatística é revelada, depois do atraso escalonado do elemento.
* **Animação:** de 0 ao valor de `data-count` em 1,6 s, curva easeOutCubic, formato pt-BR (`toLocaleString('pt-BR')`, ponto de milhar). O sinal "+" fica fora do número, em `<span class="plus">`. Números com `tabular-nums` para não tremer.
* **Sem efeitos:** o HTML já traz o valor final.

```js
function count(c){var to=+c.getAttribute('data-count'),t0=null,dur=1600;
  function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
    c.textContent=Math.round(to*e).toLocaleString('pt-BR');if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step)}
```

### 5.6 Gráfico de alucinação (bloco 04)
* Barras crescem da esquerda (`scaleX` de 0 a 1) em 1,4 s `--ease` quando o painel entra na tela. Atrasos: 0, 0,18 e 0,36 s no primeiro painel; 0,45, 0,63 e 0,81 s no segundo.
* Os valores (%, à direita) aparecem com fade de 0,6 s depois de 1 s.
* A barra da Forlex pulsa o brilho: `pulseBar 2.6s ease-in-out 1.6s infinite` (sombra até `0 0 28px rgba(89,143,178,.95)`).

### 5.7 Faixa de recursos (marquee, bloco 05)
* Loop horizontal contínuo: `animation: mq 46s linear infinite`, `translateX(-50%)` (a lista é duplicada). Pausa com o mouse em cima. Bordas com máscara em gradiente (10% de cada lado).

### 5.8 Fundo e brilhos
* Glow principal do hero: `glowA 12s ease-in-out infinite alternate` (desloca de -46% a -54% em X, escala de 0,96 a 1,08, opacidade de 0,8 a 1).
* Aurora (2 manchas com blur de 70 px): `aur1 16s` (até 160 px, 40 px, escala 1,15) e `aur2 19s` (até -180 px, 30 px, escala 0,9), ambas `ease-in-out infinite alternate`.
* Glow atrás do print do hero: `stageGlow 7s ease-in-out infinite alternate` (opacidade 0,7 a 1, scaleX 0,92 a 1,06).
* Grade de 64 px com máscara radial e ruído SVG em opacidade 0,5 (estáticos).

### 5.9 Fluxo de automação (bloco 06)
* Uma luz percorre as linhas entre Processo, LIVIA e Caixa de entrada: `wire 2.8s ease-in-out infinite`, a segunda linha com 1,1 s de atraso.

### 5.10 Hovers
* Cards claros (`.pain`, `.bcard`, `.plan`, `.sc`, `.lvcall`): sobem 4 px e ganham sombra maior, 0,45 s `--ease`.
* Cards escuros (`.gcard`, `.vpanel`, `.cmpcard`): sobem 4 px, borda azul rgba(89,143,178,.45).
* Plano em destaque: anel e glow mais fortes.
* Itens do hero e chips do marquee: sobem 2 px, borda azul.
* Botão primário: ver tabela de botões; a faixa de luz (`shine`) atravessa em 0,9 s `--ease`.
* Logos da prova: opacidade de 0,86 para 1 em 0,3 s.
* FAQ: ícone mais vira menos (rotação de 90° em 0,2 s) e o fundo do ícone fica azul.
* Hovers funcionam também em `?static=1`; em movimento reduzido as transições são zeradas.

```css
.btn::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;z-index:-1;
 background:linear-gradient(100deg,transparent,rgba(250,250,250,.38),transparent);transform:skewX(-18deg);opacity:0;pointer-events:none}
.btn:hover{translate:0 -1px;box-shadow:inset 0 1px 0 rgba(250,250,250,.32),0 0 0 1px rgba(113,157,186,1),0 0 0 6px rgba(89,143,178,.18),0 14px 36px -6px rgba(89,143,178,.8)}
.btn:hover::after{animation:shine .9s var(--ease)}
@keyframes shine{0%{left:-60%;opacity:1}100%{left:120%;opacity:1}}
```

### 5.11 Movimento reduzido
* Com `prefers-reduced-motion: reduce`, a classe `.fx` não entra (nada fica escondido) e o CSS zera tudo:

```css
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
```

### 5.12 Outros
* Rolagem suave para âncoras com `scroll-padding-top: 88px` (por causa do header fixo).
* Cabeçalho da tabela do comparativo e título do FAQ ficam fixos (sticky) durante a rolagem no desktop.

## 6. Assets

| Asset | Onde aparece | Origem |
|:--|:--|:--|
| Logo Forlex (SVG) | header, comparativo, rodapé | design system Forlex (`_build/common.py`) |
| Print da tela inicial da LIVIA | 02 Hero | print real do app, `_lp_v41/livia_home_src.png` |
| Print da resposta com jurisprudência | 04 Risco de alucinação | print real, `01_livia_jurisprudencia_fonte.png` |
| Print da lista de Processos | 05 Funcionalidades | print real, `03_processos_lista.png`, números e partes desfocados |
| Carteira da OAB | 02 Hero | `_build/carteira.webp`, preto e branco com dados borrados |
| Logo OAB Nacional | 03 Prova | s.oab.org.br/imagens/marcas-oab/oab/positiva/2x/oab-nc.png (idêntico ao Wikimedia Commons) |
| Natura, Qatar Airways, AWS | 03 Prova | Wikimedia Commons (Natura e Qatar em domínio público; AWS arquivo oficial) |
| Felipe Sarmento Advogados | 03 Prova | site oficial fsarmento.adv.br |
| Logos de ChatGPT, Claude e Gemini | 04 e 07 | ícones em SVG embutidos |
| 13 logos de seccionais | 10 Seccionais | sites oficiais de AL, BA, DF, GO, MT, PA, PB, PI, RN e SE; CE, ES e PE pelo Manual de Identidade Visual da OAB Nacional (2019), p. 20 e 21 |

Todos os logos de terceiros foram convertidos para uma cor (#C0D4E0 no fundo escuro, #0F2B38 no claro) por `lp_mockups/_build/logo_proc.py`. As fontes completas, com URL e data de acesso, estão em `lp_assets/logos/SOURCES.md` e `lp_assets/logos/seccionais/SOURCES.md`; os originais ficam nas pastas `_src/`.

**Autorização.** O site da OAB-ES informa que o uso da logomarca em publicidade depende de autorização prévia da Seccional ou do Conselho Federal, e o Manual de Identidade Visual da OAB pede o mesmo cuidado. Antes de veicular, é preciso ter a autorização da OAB Nacional e das seccionais para os logos usados (OAB Nacional no bloco 03 e as 13 seccionais no bloco 10). Vale também confirmar o uso dos logos de clientes (Natura, Qatar Airways, AWS, Felipe Sarmento Advogados).

## 7. Fontes da copy e afirmações para revisar

* **"Taxa de alucinação da LIVIA: menor que 5%".** O e-book da Forlex fala em 2% a 8%. "Menor que 5%" vai além do que o e-book sustenta; precisa de validação do João (ou trocar pela faixa do e-book).
* **Estudos.** Stanford RegLab (Magesh et al., 2024/2025): 17% a 33% em três ferramentas comerciais dos EUA, citado via e-book "A alucinação que a IA generalista esconde" (v1.5, maio de 2026), cap. 3, p. 18. AA-Omniscience (Artificial Analysis, acesso em 01/10/2026): Claude Opus 5.5 58,6%, GPT-6 Astra 51,3%, Gemini 4 Argon 15,1%. O ranking muda com frequência; conferir os números na data da veiculação.
* **TST.** Decisão de 10/03/2026 da 6ª Turma, multa por citações falsas em caso de possível uso de IA. A página não diz qual ferramenta foi usada.
* **Publicidade comparativa (CONAR).** O comparativo com ChatGPT, Claude e Gemini precisa seguir as regras do CONAR para publicidade comparativa (comparação objetiva e verificável); revisão do João.
* **Cálculos jurídicos.** O recurso está em Beta; confirmar se pode aparecer sem indicação de Beta.
* **Módulos do Starter.** A lista do card do Starter e a resposta "Tudo isso vem no Starter?" dependem da revisão do João.
* **Números da prova.** +120.000 usuários e +7.000 usuários corporativos: dados da Forlex. 9 países: forlex.ai, revisado em maio de 2026. Relacionamentos: forlex.ai/customers.
* **Benefício.** A página não promete prazo do benefício e usa sempre "advogados com inscrição ativa na OAB têm acesso".

## 8. Acessibilidade

* `lang="pt-BR"`, um único H1, hierarquia H2 e H3 por bloco.
* Todas as imagens têm texto alternativo descritivo (prints, carteira, logos com o nome da marca ou seccional).
* Rotação do H1: o leitor de tela lê só "Seu ChatGPT conversa."; as outras marcas têm `aria-hidden`.
* Movimento reduzido respeitado (sem rotação, sem revelações, sem loops). `?static=1` dá o mesmo resultado.
* Sem JavaScript, todo o conteúdo fica visível.
* Foco visível nos botões (contorno de 2 px #C0D4E0). FAQ com `details`/`summary` nativo, acessível por teclado.
* Contraste: texto #091920 no botão #598FB2 tem cerca de 5,1:1 (passa AA para texto normal); texto #C0D4E0 em #091920 tem cerca de 11,7:1.
* Sem rolagem horizontal em 390 px e 1440 px (verificado no QA).

## 9. Onde estão os arquivos

* Página v4.4 (entrega): `/workspace/copy-studio/entregas/LP_A_v4.4.html`
* Página v4.4 (mockups): `/workspace/copy-studio/lp_mockups/lp_a_v4_4.html`
* Build: `lp_mockups/_build/make_build_v44.py` gera `build_a_v4_4.py` a partir de `build_a_v4_3_1.py`; QA em `lp_mockups/_build/qa_v4_4.py`.
* CSS fonte: `lp_mockups/_build/lp_a_v3.css`, `lp_a_v4.css`, `lp_a_v4_1.css`, `lp_a_v4_2.css`, `lp_a_v4_3.css`, `lp_a_v4_3_1.css` (nessa ordem). JS: `lp_a_v4_3_head.js` e `lp_a_v4_3_fx.js`.
* Variantes para importar no Figma (estado final, sem JS, largura fixa): `lp_mockups/lp_a_v4_4_capture_desktop.html` (1440) e `lp_mockups/lp_a_v4_4_capture_mobile.html` (390, com o CSS mobile aplicado sempre). Cópias em `entregas/figma/`.
* Esta documentação: `/workspace/copy-studio/entregas/LP_A_v4.4_documentacao.md`
* Figma: arquivo "Forlex Meta Ads OAB v3", página "LP A Novos usuarios": https://www.figma.com/design/hIDKP4XKpvDsX507tTfVn8/Forlex-Meta-Ads-OAB-v3?node-id=43-276

**Status do Figma (01/10/2026).** A importação em camadas editáveis não foi feita: a primeira chamada ao conector do Figma voltou com o limite de chamadas do plano Starter ("You've reached the Figma MCP tool call limit on the Starter plan"). A página continua vazia. As variantes de captura acima já estão prontas e verificadas; quando houver cota, a importação usa o seletor `[data-figma]` (13 blocos por largura). Os links dos frames "LP A v4.4 Desktop 1440" e "LP A v4.4 Mobile 390" e dos componentes "Headline / Marca" e do botão primário entram aqui depois da importação.
