export interface FeedPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timeAgo: string;
  body: string;
}

export const FAKE_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Alex Rivera',
    handle: '@alexrivera',
    avatar: 'AR',
    timeAgo: '2h',
    body: 'Just shipped the new Angular adapter test harness. Multiple reply editors on one screen — no problem.',
  },
  {
    id: 'post-2',
    author: 'Jordan Lee',
    handle: '@jordanlee',
    avatar: 'JL',
    timeAgo: '4h',
    body: 'Anyone else autosaving comment drafts to localStorage while debugging lifecycle events?',
  },
  {
    id: 'post-3',
    author: 'Sam Patel',
    handle: '@sampatel',
    avatar: 'SP',
    timeAgo: '1d',
    body: 'Cancel should tear down the editor instance cleanly. Watching mount/destroy counts in the console.',
  },
  {
    id: 'post-4',
    author: 'Morgan Chen',
    handle: '@morganchen',
    avatar: 'MC',
    timeAgo: '2d',
    body: 'Preview panel under the reply box is underrated. You see exactly what will post before you commit.',
  },
];
