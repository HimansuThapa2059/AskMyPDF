export interface FileType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  uploadStatus: 'PENDING' | 'PROCESSING' | 'FAILED' | 'SUCCESS';
  url: string;
  key: string;
  userId: string | null;
}

export type FileArray = FileType[];
