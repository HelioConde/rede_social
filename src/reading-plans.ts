/**
 * Planos editoriais autorais, com referências para consulta em uma Bíblia do leitor.
 * Não reproduzem trechos de traduções modernas, nem dependem de API remota.
 */
export type ReadingPlan = {
  id: string;
  name: string;
  description: string;
  theme: string;
  days: { entryId: string; action: string }[];
};
export const readingPlans: ReadingPlan[] = [
  {
    id: 'paz',
    name: '7 dias para encontrar paz',
    description: 'Uma jornada de acolhimento, descanso e oração sem pressa.',
    theme: 'Paz e descanso',
    days: [
      {entryId:'filipenses-4-6',action:'Escreva uma preocupação que deseja entregar em oração.'},
      {entryId:'mateus-11-28',action:'Reserve uma pausa sem distrações.'},
      {entryId:'joao-14-27',action:'Identifique algo que traz serenidade ao seu coração.'},
      {entryId:'salmo-91',action:'Reflita sobre a ideia de cuidado e refúgio.'},
      {entryId:'salmo-46',action:'Observe onde pode encontrar apoio hoje.'},
      {entryId:'salmo-23',action:'Separe um pequeno tempo de descanso.'},
      {entryId:'mateus-5-9',action:'Pratique um gesto que constrói paz.'},
    ],
  },
  {
    id:'esperanca',
    name:'7 dias de esperança',
    description:'Pequenos passos para fortalecer a confiança em tempos incertos.',
    theme:'Esperança',
    days:[
      {entryId:'salmo-121',action:'Reconheça uma pessoa ou recurso com que pode contar.'},
      {entryId:'romanos-15-13',action:'Observe um motivo para continuar.'},
      {entryId:'lamentacoes-3-22',action:'Anote uma oportunidade de recomeço.'},
      {entryId:'salmo-91',action:'Lembre de um momento em que recebeu cuidado.'},
      {entryId:'romanos-12-2',action:'Pense em uma mudança possível.'},
      {entryId:'salmo-23',action:'Permita-se avançar com calma.'},
      {entryId:'proverbios-3-5',action:'Reflita sobre o próximo passo com confiança.'},
    ],
  },
  {
    id:'coragem',
    name:'7 dias de coragem',
    description:'Reflexões para lidar com mudanças e enfrentar o novo com gentileza.',
    theme:'Coragem e propósito',
    days:[
      {entryId:'isaias-41-10',action:'Nomeie um medo e um apoio disponível.'},
      {entryId:'josue-1-9',action:'Dê um passo pequeno e possível.'},
      {entryId:'tiago-1-5',action:'Reserve um momento para pedir sabedoria.'},
      {entryId:'salmo-46',action:'Encontre um ponto de segurança.'},
      {entryId:'romanos-12-2',action:'Questione uma ideia que limita você.'},
      {entryId:'corintios-13',action:'Demonstre gentileza em uma situação difícil.'},
      {entryId:'romanos-15-13',action:'Celebre uma conquista, mesmo pequena.'},
    ],
  },
];
