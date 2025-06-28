import { generateFakeCell } from './gallery';
import { branch } from '$lib/stores/branch.svelte';
import { tuyau } from '$lib/api';
import { space } from '$lib/stores/space.svelte';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { cuid } from './id';

export type FileMetadata = {
  id: string;
  name: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  duration: number;
  firstFrame?: Blob;
};

export async function getMediaMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {
    id: cuid(),
    name: file.name,
    mime: file.type,
    size: file.size,
    width: 0,
    height: 0,
    duration: 0
  };

  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        metadata.width = img.width;
        metadata.height = img.height;
        URL.revokeObjectURL(img.src);
        resolve(metadata);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  if (file.type.startsWith('video/')) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');

      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      video.src = url;
      video.autoplay = true;
      video.muted = true;

      const cleanup = () => {
        video.removeAttribute('src');
        URL.revokeObjectURL(url);
      };

      video.onerror = () => {
        cleanup();
        reject(new Error(`Failed to upload the video: ${video.error?.message}`));
      };

      video.onloadedmetadata = async () => {
        metadata.width = video.videoWidth;
        metadata.height = video.videoHeight;
        metadata.duration = Math.floor(video.duration);

        const thumbnail = (await generateThumbnail(video)) as Blob;
        metadata.firstFrame = thumbnail;

        video.pause();
        cleanup();
        resolve(metadata);
      };
    });
  }

  return metadata;
}

const generateThumbnail = async (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    };
    video.currentTime = 0.1;
  });
};

export function generateMaximizedSize(originalHeight: number, originalWidth: number) {
  const vHeight = window.innerHeight * 0.8;
  const vWidth = window.innerWidth * 0.8;

  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > vWidth || originalHeight > vHeight) {
    if (vWidth / vHeight > aspectRatio) {
      newHeight = vHeight;
      newWidth = vHeight * aspectRatio;
    } else {
      newWidth = vWidth;
      newHeight = vWidth / aspectRatio;
    }
  }

  return { height: newHeight, width: newWidth };
}

export async function getPDFFirstPage({ pdfURL, file }: { pdfURL?: string; file?: File }) {
  let pdf: PDFDocumentProxy;
  if (file) {
    const buffer = await file.arrayBuffer();
    pdf = await pdfjsLib.getDocument(buffer).promise;
  } else if (pdfURL) {
    pdf = await pdfjsLib.getDocument({ url: pdfURL, withCredentials: true }).promise;
  } else {
    return '';
  }
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!ctx) return '';

  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;

  return canvas.toDataURL();
}

export async function uploadMediaFromExt(sourceUrl: string, uri: string) {
  const payload = {
    spaceId: space.currentSpace?.id.toString(),
    branchId: space.currentBranch?.id.toString(),
    fromUrl: sourceUrl,
    mediaUrl: uri
  };

  const { error } = await tuyau.v1.branch.extension.add.$post(payload, {
    timeout: false
  });
  if (error) {
    console.error(error);
  }
}

export async function uploadMedia(
  items?: DataTransferItemList,
  files?: FileList | null,
  title?: string
) {
  const formData = new FormData();

  const filesToUpload = [];
  let filesMetadata: FileMetadata[] = [];

  if (items) {
    const filesToProcess: Promise<FileMetadata>[] = [];
    const allItems = [...items].filter((item) => item.kind === 'file');

    allItems.forEach((item) => {
      const file = item.getAsFile();
      filesToUpload.push(file);
      filesToProcess.push(getMediaMetadata(file!));
    });

    filesMetadata = await Promise.all(filesToProcess);
  } else if (files) {
    const filesToProcess = [...files].map((file) => getMediaMetadata(file));
    filesMetadata = await Promise.all(filesToProcess);
    filesToUpload.push(...files);
  }

  formData.append('spaceId', '' + space.currentSpace!.id);
  formData.append('branchId', '' + space.currentBranch!.id);
  if (title) {
    formData.append('title', '' + title);
  }

  const fakeCells = [];
  for (let i = 0; i < filesToUpload.length; ++i) {
    const file = filesToUpload[i];
    const metadata = filesMetadata[i];

    fakeCells.push(await generateFakeCell(file, metadata));

    formData.append(`files[]`, file);
    formData.append(`filesMetadata[]`, JSON.stringify(metadata));
    if (metadata.firstFrame) {
      formData.append(`thumbnails[]`, metadata.firstFrame, `${removeFileExtension(file.name)}.jpg`);
    }
  }
  branch.addCells(fakeCells);

  const { data, error } = await tuyau.v1.branch.upload.$post(formData, {
    timeout: false
  });

  //TODO: add toast error to explain the validation error
  if (error) {
    switch (error.status) {
      case 400:
        branch.rewind();
        break;
      default:
        break;
    }
  }

  branch.updateCells(data);
}

function removeFileExtension(fileName: string) {
  const dotIdx = fileName.lastIndexOf('.');
  return dotIdx === -1 ? fileName : fileName.substring(0, dotIdx);
}
