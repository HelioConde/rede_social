import type { SocialData } from './types';
const now = Date.now();
export const starterData = (): SocialData => ({
  version: 1,
  activeId: 'me',
  profiles: [
    { id: 'me', name: 'Visitante', handle: 'visitante', bio: 'Bem-vindo à Rede Jovem! Personalize seu espaço e compartilhe suas ideias.', city: 'Brasil', avatar: '', color: '#5271ed' },
    { id: 'ana', name: 'Ana Martins', handle: 'anamartins', bio: 'Fotografia, viagens e boas histórias.', city: 'São Paulo', avatar: '', color: '#cc6ca0' },
    { id: 'leo', name: 'Léo Oliveira', handle: 'leoliveira', bio: 'Música, jogos e tecnologia 🎮', city: 'Curitiba', avatar: '', color: '#1caeaa' },
    { id: 'bia', name: 'Bia Costa', handle: 'biacosta', bio: 'Arte, livros e café.', city: 'Brasília', avatar: '', color: '#b387e4' },
    { id: 'rafa', name: 'Rafa Lima', handle: 'rafalima', bio: 'Explorando a programação e o mundo!', city: 'Recife', avatar: '', color: '#e18b43' },
  ],
  posts: [
    { id:'p1', authorId:'ana', body:'Um novo dia, novas possibilidades! ☀️ Qual foi a melhor coisa que aconteceu com você hoje?', createdAt: now - 36e5, likedBy:['leo','bia'], comments:[{ id:'c1', authorId:'bia', body:'Amei essa energia! 💙', createdAt:now-18e5 }] },
    { id:'p2', authorId:'leo', body:'Depois de muito estudo, terminei meu primeiro projeto de programação. Pequenas conquistas também merecem ser comemoradas! 🚀', createdAt: now - 72e5, likedBy:['ana','rafa','me'], comments:[] },
    { id:'p3', authorId:'bia', body:'A criatividade conecta pessoas. Que tal trocar ideias e compartilhar o que você está criando? ✨', createdAt: now - 108e5, likedBy:['ana'], comments:[] },
  ],
  friendships: [{userId:'ana',status:'friends'},{userId:'leo',status:'friends'},{userId:'bia',status:'pending'},{userId:'rafa',status:'suggested'}],
  messages: [
    {id:'m1', from:'ana', to:'me',body:'Oi! Seja bem-vindo à Rede Jovem. 😊',createdAt:now-46e5},
    {id:'m2', from:'me', to:'ana',body:'Obrigado! Estou conhecendo a comunidade.',createdAt:now-42e5},
    {id:'m3', from:'leo', to:'me',body:'E aí, tudo certo? Bora conversar sobre projetos!',createdAt:now-37e5},
  ],
});
