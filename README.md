# AcronPix Bot

Bot Telegram com Telegraf, menu, suporte WhatsApp e comandos configurados automaticamente.

## Instalar
1. Instale Node.js 20 ou superior.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e coloque **um token novo**, gerado no @BotFather após revogar o token partilhado anteriormente.
4. Execute `npm start`.

O bot usa polling e precisa de um processo em execução para responder. Para funcionar 24h, instale num servidor que mantenha o processo ativo. Não execute duas instâncias com polling ao mesmo tempo.

## Comandos
`/start`, `/menu`, `/chave`, `/suporte`, `/ajuda`, `/help`, `/status`.

**Nota:** `/chave` não divulga uma chave universal fixa. Está preparado para futura integração com emissão individual e segura de chaves de ativação.

## Segurança
Nunca coloque o token diretamente no código ou num commit. Guarde-o em variável de ambiente `BOT_TOKEN`. O ficheiro `.env` está ignorado pelo Git.

## Configurar destinatários PIX
O menu exibe os nomes automaticamente. Os números de CPF e telefone **não são guardados no repositório público**. Configure no servidor uma variável de ambiente `PIX_KEYS_JSON` com JSON no formato:

```json
{"neusa":{"name":"Nome completo","type":"CPF","key":"CPF sem pontuação"},"atalia":{"name":"Nome completo","type":"Celular","key":"Telefone","bank":"Banco opcional"}}
```

IDs aceitos: `neusa`, `atalia`, `eduardo`, `messias`, `gabriela`, `mariza`, `ligartina`. Sem configuração, o bot informa que os dados estão temporariamente indisponíveis. Para copiar a chave no Telegram, o botão envia o valor em mensagem separada.
