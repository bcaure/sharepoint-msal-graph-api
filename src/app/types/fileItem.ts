import { GenericItem } from "./genericItem";

export type FileItem = GenericItem & {
  "@microsoft.graph.downloadUrl": string;
  file: {
      hashes: {
          quickXorHash: string;
      },
      mimeType: string;
  },
  image: {
      "height": number;
      "width": number;
  },
  photo: {
      alternateTakenDateTime: string;
  },
};

export const FileItemGuard = (item: GenericItem): item is FileItem => {
  return (item as FileItem).file !== undefined;
};
