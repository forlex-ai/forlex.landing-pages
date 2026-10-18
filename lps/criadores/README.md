# LP C — `/criadores` (Programa Criador Fundador · Forlex Marketplace)

- **Version:** `LP_C_criadores_v1` (18/10/2026)
- **Audience:** Advogados especialistas, sócios de bancas boutiques, pareceristas, professores de Direito e líderes de prática jurídica com OAB ativa.
- **Goal:** Publicar o primeiro Agente, Skill ou Workflow jurídico verificado no Forlex Marketplace para garantir **20% de royalties em ACUs** (dobro da taxa padrão de 10%) e ativar o loop viral de compartilhamento com `?ref=`.
- **Canonical URL:** `https://go.forlex.ai/criadores` (e `https://www.forlex.ai/criadores` via rewrite em `forlex.site`).
- **Source:** `source.html` (alinhado 1:1 ao design system das LPs Forlex: tipografia `Sora` + `Inter` WOFF2 embarcada, paleta `--c950`/`--c900`/`--c800`/`--blue`/`--b450`/`--b200`/`--gelo`/`--off`, seções `data-figma`, suporte a `?static=1` e `prefers-reduced-motion`).

---

## CTAs (6, destino unificado com atribuição de campanha)

`https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=programa_criadores_20pct&utm_content=lp_c_criadores`

| # | Bloco (`data-figma`) | Copy do CTA |
| --- | --- | --- |
| 1 | `Header` | `Publicar meu 1º Agente` |
| 2 | `Hero` | `Publicar meu 1º Agente e garantir 20%` |
| 3 | `Simulador de Royalties` | `Criar meu 1º Agente com 20% de Royalties` |
| 4 | `Como Funciona (Flywheel Viral)` | `Começar a publicar no Marketplace` |
| 5 | `Oferta Criador Fundador` | `Garantir minha vaga de Criador Fundador (20%)` |
| 6 | `CTA Final` | `Publicar meu 1º Agente e travar 20%` |

---

## Componentes Interativos e Flags

- **Simulador Interativo de Royalties + Bônus Viral (`?ref=`):**
  - 3 perfis rápidos (*Especialista Nichado*, *Autoridade de Área*, *Referência Nacional*) + 3 controles deslizantes acessíveis (`aria-label`, `min`/`max`/`step`):
    1. Execuções mensais no Marketplace (`50` a `3.000` runs/mês)
    2. Consumo médio por execução (`20` a `200` ACUs/run)
    3. Novos assinantes indicados via link `?ref=` (`0` a `30` indicações/mês)
  - Cálculo em tempo real:
    - **Royalties Criador Fundador (20% · `2000 bps`):** $\text{Runs} \times \text{ACUs/run} \times 0{,}20$ vs. Taxa Padrão (10% · `1000 bps`).
    - **Bônus de Indicação (`?ref=`):** $+50\text{ ACUs}$ por novo assinante convertido pelo link de compartilhamento.
    - Projeção mensal e anualizada em ACUs para reinvestir na banca (pesquisa jurisprudencial, redação de peças, auditoria documental e automações multi-agente).
- **Flags de QA e Acessibilidade:**
  - `?static=1` — estado estático imediato, sem animações de entrada (para captura de screenshots e regressão visual).
  - `prefers-reduced-motion: reduce` — desativa transições e animações respeitando a preferência do sistema operacional.

---

## Playbook de Go-To-Market (GTM) Viral — Programa Criador Fundador

### 1. Mecânica Econômica de Escassez Real (20% vs. 10%)
- **Âncora de Valor:** A taxa padrão documentada do Forlex Marketplace é de **10% (`1000 bps`)** sobre o consumo líquido de ACUs. Durante a janela de lançamento (**Programa Criador Fundador**), os primeiros **100 especialistas verificados** (ou publicações aprovadas na janela inicial) travam **20% (`2000 bps`)** — o dobro de royalties.
- **Gatilho de Ativação:** O benefício não exige pagamento adicional; exige **publicação aprovada** no Marketplace + **compartilhamento ativo**.

### 2. Os 3 Loops Virais Integrados ao Produto (Zero-CAC Distribution)
1. **Loop de Atribuição e Referral (`?ref=<organization_id>`):**
   - Cada listagem aprovada no Marketplace possui botão nativo **"Compartilhar e Ganhar ACUs"** no Studio (`MarketplacePage.vue`), gerando mensagem pronta para LinkedIn, WhatsApp e e-mail com a URL da listagem parametrizada (`?ref=org_...&utm_source=creator_share&utm_medium=referral&utm_campaign=founding_creator_20pct`).
   - Cada colega advogado que instala e executa o agente a partir do link gera:
     - **20% de royalties recorrentes** sobre cada execução faturável.
     - **Bônus de aquisição em ACUs** quando uma nova banca ativa assinatura paga via link do criador.
2. **Loop de Prova Social Executável (LinkedIn / WhatsApp Jurídico):**
   - Advogados não compartilham "propaganda de software"; compartilham **autoridade intelectual**.
   - Ao publicar um agente (ex.: *Auditor de Contratos SaaS & LGPD* ou *Revisor de Recurso Especial STJ*), o criador recebe o selo **Criador Fundador Verificado OAB** e um card Open Graph (`1200×630`) otimizado para feed profissional.
3. **Loop de Demanda Reversa (Request-for-Agent / Categorias em Alta):**
   - A seção de **6 Categorias de Alta Demanda** na LP direciona os criadores exatamente para as dores de maior volume de execuções na plataforma (Tributário, Trabalhista, M&A/Societário, Cível/STJ, Previdenciário e Família/Sucessões), maximizando liquidez desde o dia 1.

### 3. Estratégia de Canais e Sequência de Lançamento
- **Onda 1 — Seeding VIP (Dias 1–5):**
  - Convite direto para os 50 power-users mais ativos do Studio Forlex e professores/coordenadores de pós-graduação jurídica com link direto para `go.forlex.ai/criadores`.
  - Meta: 25 agentes fundadores publicados antes da abertura de tráfego pago.
- **Onda 2 — Aquisição Meta Ads + LinkedIn Ads (Dias 6–21):**
  - Criativos estáticos e em vídeo curto destacando o **Simulador de Royalties** (*"Quanto vale a metodologia da sua banca quando 500 escritórios usam seu agente?"*).
  - Destino primário de mídia paga: `https://go.forlex.ai/criadores?utm_source=meta&utm_medium=paid_social&utm_campaign=programa_criadores_20pct&utm_content=lp_c_criadores`.
- **Onda 3 — Ranking Público & Fechamento da Coorte 20% (Dias 22–30):**
  - Divulgação dos Top 10 Agentes Jurídicos mais instalados da quinzena e contagem regressiva para encerramento das vagas com `2000 bps` (retorno à taxa padrão de `1000 bps`).

---

## QA

```bash
npm run qa
npm run build
npm run qa:built
npm run dev  # http://127.0.0.1:3000/criadores
```
