export type ID = string;
export type Profile = { id: ID; name: string; handle: string; bio: string; city: string; avatar: string; cover?: string; color: string };
export type Comment = { id: ID; authorId: ID; body: string; createdAt: number };
export type Post = { id: ID; authorId: ID; body: string; image?: string; createdAt: number; likedBy: ID[]; comments: Comment[] };
export type FriendStatus = { userId: ID; status: 'friends' | 'pending' | 'suggested' | 'sent' };
export type Message = { id: ID; from: ID; to: ID; body: string; createdAt: number };
export type SocialData = { version: number; activeId: ID; profiles: Profile[]; posts: Post[]; friendships: FriendStatus[]; messages: Message[] };
export type Section = 'feed' | 'profile' | 'friends' | 'messages' | 'explore' | 'settings';
