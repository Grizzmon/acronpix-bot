import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('Configure BOT_TOKEN no ambiente.');
const bot = new Telegraf(token);
const support = 'https://wa.me/258841377635?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20o%20Acron%20Pix!';
const menu = Markup.inlineKeyboard([
  [Markup.button.callback('🔑 Chaves PIX', 'chave')],
  [Markup.button.url('💬 Falar com atendente', support)],
  [Markup.button.callback('📌 Ajuda', 'ajuda'), Markup.button.callback('🟢 Status', 'status')]
]);
const welcome = ctx => ctx.reply('👋 Bem-vindo ao Acron Pix! Escolha uma opção abaixo.', menu);
const help = ctx => ctx.reply('📌 Central de Ajuda\n\n/start — Início\n/chave — Chaves PIX\n/suporte — Atendimento humano\n/status — Estado do bot\n/menu — Menu principal\n/ajuda — Ajuda', Markup.inlineKeyboard([[Markup.button.url('💬 Chamar no WhatsApp', support)]]));
const recipients = [
  ['neusa', 'Neusa'], ['atalia', 'Atalia'], ['eduardo', 'Eduardo'],
  ['messias', 'Messias'], ['gabriela', 'Gabriela'],
  ['mariza', 'Mariza'], ['ligartina', 'Ligartina']
];
const pixKeys = (() => {
  try { return JSON.parse(process.env.PIX_KEYS_JSON || '{}'); }
  catch { console.error('PIX_KEYS_JSON inválido'); return {}; }
})();
const key = ctx => ctx.reply('🔑 *CHAVES PIX DISPONÍVEIS*\\n\\nSelecione um nome para consultar os dados de pagamento:', {
  parse_mode: 'Markdown',
  ...Markup.inlineKeyboard(recipients.map(([id, name]) => [Markup.button.callback('👤 ' + name, 'pix:' + id)]))
});
bot.action(/^pix:([a-z]+)$/, async ctx => {
  await ctx.answerCbQuery();
  const id = ctx.match[1];
  const recipient = recipients.find(([key]) => key === id);
  if (!recipient) return ctx.reply('Opção inválida.');
  const data = pixKeys[id];
  if (!data?.name || !data?.key || !data?.type) return ctx.reply('⏳ Dados PIX temporariamente indisponíveis. Contacte o suporte.', Markup.inlineKeyboard([[Markup.button.url('💬 Suporte', support)]]));
  const info = ['💠 DADOS PARA PAGAMENTO PIX', '', '👤 Titular: ' + data.name, '🔑 Tipo: ' + data.type, '📋 Chave: ' + data.key];
  if (data.bank) info.push('🏦 Banco: ' + data.bank);
  info.push('', '⚠️ Confirme o nome do destinatário no aplicativo do banco antes de pagar.');
  return ctx.reply(info.join('\\n'), Markup.inlineKeyboard([
    [Markup.button.callback('📋 Mostrar chave para copiar', 'copy:' + id)],
    [Markup.button.callback('⬅️ Outras chaves', 'chave')],
    [Markup.button.url('💬 Enviar comprovativo ao suporte', support)]
  ]));
});
bot.action(/^copy:([a-z]+)$/, async ctx => {
  await ctx.answerCbQuery();
  const data = pixKeys[ctx.match[1]];
  return ctx.reply(data?.key || 'Chave indisponível.');
});
const status = ctx => ctx.reply('🟢 O bot está online e a responder.');
const supportReply = ctx => ctx.reply('Precisa de ajuda com o Acron Pix? Fale com um atendente humano:', Markup.inlineKeyboard([[Markup.button.url('💬 Falar com Atendente', support)]]));
bot.start(welcome);
bot.command('menu', welcome);
bot.command(['ajuda', 'help'], help);
bot.command('chave', key);
bot.command('status', status);
bot.command('suporte', supportReply);
bot.action('chave', async ctx => { await ctx.answerCbQuery(); await key(ctx); });
bot.action('ajuda', async ctx => { await ctx.answerCbQuery(); await help(ctx); });
bot.action('status', async ctx => { await ctx.answerCbQuery(); await status(ctx); });
bot.catch((err) => console.error('Erro do bot:', err));
await bot.telegram.setMyCommands([
  { command: 'start', description: 'Iniciar Acron Pix' },
  { command: 'menu', description: 'Abrir menu principal' },
  { command: 'chave', description: 'Consultar chave de ativação' },
  { command: 'suporte', description: 'Falar com atendente' },
  { command: 'ajuda', description: 'Central de ajuda' },
  { command: 'status', description: 'Verificar funcionamento' }
]);
await bot.launch();
console.log('AcronPix Bot iniciado.');
const stop = signal => { console.log(`Recebido ${signal}`); bot.stop(signal); };
process.once('SIGINT', () => stop('SIGINT'));
process.once('SIGTERM', () => stop('SIGTERM'));
