/**
 * Reflexões AUTORAIS baseadas em referências bíblicas, não citações literais
 * de traduções modernas. Curadoria local, sem API externa e sem tracking.
 */
export const faithTopics = ['Todos', 'Esperança', 'Paz', 'Amor', 'Coragem', 'Gratidão', 'Propósito'] as const;
export type FaithTopic = typeof faithTopics[number];
export type FaithEntry = {
  id: string;
  ref: string;
  topic: Exclude<FaithTopic,'Todos'>;
  title: string;
  reflection: string;
  question: string;
};
export const faithEntries: FaithEntry[] = [
  { id:'isaias-41-10', ref:'Isaías 41:10', topic:'Coragem', title:'Você não precisa enfrentar tudo sozinho', reflection:'Há dias em que o medo parece maior que nossos planos. Esta passagem nos convida a lembrar do cuidado e da presença de Deus mesmo quando o caminho é incerto.', question:'Qual desafio você quer enfrentar com mais coragem hoje?' },
  { id:'filipenses-4-6', ref:'Filipenses 4:6–7', topic:'Paz', title:'Entregue o peso do dia', reflection:'Preocupações existem, mas não precisam ocupar todos os espaços da vida. A oração, a gratidão e a confiança podem ajudar a cultivar serenidade.', question:'O que você gostaria de colocar em oração?' },
  { id:'salmo-23', ref:'Salmo 23:1–4', topic:'Esperança', title:'Há direção mesmo nos dias difíceis', reflection:'A imagem do pastor que cuida de suas ovelhas inspira confiança, provisão e descanso. A esperança pode caminhar conosco até nos vales mais escuros.', question:'Onde você precisa de descanso ou direção?' },
  { id:'josue-1-9', ref:'Josué 1:9', topic:'Coragem', title:'Um passo de cada vez', reflection:'Coragem não é ausência de medo. É decidir continuar, sustentado pela convicção de que a caminhada tem companhia e propósito.', question:'Que pequeno passo você pode dar agora?' },
  { id:'corintios-13', ref:'1 Coríntios 13:4–7', topic:'Amor', title:'O amor aparece nas atitudes', reflection:'Paciência, bondade e respeito transformam o cotidiano. Amar também significa aprender a ouvir, oferecer ajuda e tratar o outro com dignidade.', question:'A quem você pode demonstrar cuidado hoje?' },
  { id:'salmo-121', ref:'Salmo 121:1–2', topic:'Esperança', title:'Olhe além do obstáculo', reflection:'Em meio às incertezas, o salmista volta os olhos para a origem de seu socorro. Encontrar apoio é um sinal de esperança, não de fraqueza.', question:'Quem pode caminhar ao seu lado esta semana?' },
  { id:'romanos-12-2', ref:'Romanos 12:2', topic:'Propósito', title:'Recomeçar também é crescer', reflection:'Uma nova maneira de pensar pode abrir novas possibilidades. O crescimento interior exige escolhas conscientes e disposição para mudar.', question:'Qual hábito você deseja transformar?' },
  { id:'proverbios-3-5', ref:'Provérbios 3:5–6', topic:'Propósito', title:'Confiança para o próximo caminho', reflection:'Nem tudo na vida cabe nos nossos próprios cálculos. Esta passagem inspira humildade, discernimento e confiança nas decisões.', question:'Que decisão merece mais reflexão?' },
  { id:'romanos-15-13', ref:'Romanos 15:13', topic:'Esperança', title:'Espaço para a esperança florescer', reflection:'A esperança não elimina as dificuldades, mas pode trazer fôlego, confiança e alegria para seguir em frente.', question:'O que renovou sua esperança recentemente?' },
  { id:'salmo-100-4', ref:'Salmo 100:4', topic:'Gratidão', title:'Perceba os pequenos presentes', reflection:'A gratidão pode começar com algo simples: um encontro, um gesto de cuidado ou mais uma oportunidade de recomeçar.', question:'Por qual pequena coisa você é grato hoje?' },
  { id:'mateus-11-28', ref:'Mateus 11:28', topic:'Paz', title:'O descanso também importa', reflection:'Quando o ritmo fica pesado, lembrar de descansar pode ser um gesto de sabedoria. Esta passagem fala ao coração cansado.', question:'Que espaço você pode reservar para descansar?' },
  { id:'mateus-5-9', ref:'Mateus 5:9', topic:'Amor', title:'Ser presença de paz', reflection:'Fazer a paz é mais que evitar conflitos: é procurar compreensão, respeito e caminhos para reconstruir relações.', question:'Que conversa merece mais gentileza?' },
];
export const faithPalettes=[
  {id:'sereno',name:'Azul Sereno',detail:'Confiança e serenidade',swatches:['#163D63','#3D7FA1','#E8F2FA']},
  {id:'esperanca',name:'Verde Esperança',detail:'Acolhimento e renovação',swatches:['#284D41','#A1B9A4','#F4F3E9']},
  {id:'luz',name:'Luz e Fé',detail:'Calor e inspiração',swatches:['#263C61','#C49A52','#FFF9EE']},
] as const;
export type FaithPalette=typeof faithPalettes[number]['id'];
