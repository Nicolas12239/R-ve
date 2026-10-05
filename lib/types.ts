export type Epigraph = { text: string; source: string };

export type CoverConfig = {
  motif: string;
  palette: string;
  seed: number;
  titlePos: "top" | "bottom";
};

export type Work = {
  id: number;
  slug: string;
  title: string;
  cover_title: string;
  subtitle: string | null;
  theme: string | null;
  excerpt: string | null;
  epigraphs: Epigraph[];
  content: string;
  cover: CoverConfig;
  published: boolean;
  views: number;
  created_at: string;
  likes: number;
  comments: number;
};

export type CommentItem = {
  id: number;
  parentId: number | null;
  replyTo: string | null;
  author: string;
  kind: "texte" | "ecrit";
  body: string | null;
  sticker: string | null;
  image: string | null;
  createdAt: string;
  likes: number;
  liked: boolean;
  mine: boolean;
  replies?: CommentItem[];
};
