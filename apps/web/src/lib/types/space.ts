import type { JSONContent } from '@tiptap/core';

export type CellType = 'media' | 'note' | 'default';

export type TSpace = {
  id: string;
  ownerId: string;
  name: string;
  branches: TBranch[];
};

export type TBranch = {
  id: string;
  spaceId: string;
  name: string;
};

export type TCell = TPhoto | TNote;

export type TDefault = {
  id: number;
  type: 'default';
  width: number;
  height: number;
  x: number;
  y: number;
};

export type TPhoto = {
  id: string;
  type: 'photo';
  title: string;
  content: JSONContent | undefined;
  blurUrl: string;
  originalUrl: string;
  sourceUrl: string | null;
  resizedUrl: string;
  width: number;
  mime: string;
  height: number;
  originalWidth: number;
  originalHeight: number;
  tags: string;
  x: number;
  y: number;
  aspectRatio: number;
  createdAt: string;
};

export type TVideo = {
  id: string;
  type: 'video';
  title: string;
  content: JSONContent | undefined;
  blurUrl: string;
  originalUrl: string;
  thumbnailUrl: string;
  mime: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  tags: string;
  x: number;
  y: number;
  aspectRatio: number;
  duration: number;
  createdAt: string;
};

export type TPDF = {
  id: string;
  type: 'pdf';
  title: string;
  content: JSONContent | undefined;
  originalUrl: string;
  blurUrl: string;
  mime: string;
  width: number;
  height: number;
  tags: string;
  x: number;
  y: number;
  aspectRatio: number;
  createdAt: string;
};

export type TNote = {
  id: string;
  type: 'note';
  title: string;
  content: JSONContent | undefined;
  width: number;
  tags: string;
  height: number;
  x: number;
  y: number;
  createdAt: string;
};
