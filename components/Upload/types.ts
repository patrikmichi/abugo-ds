import type React from 'react';

export type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';
export type UploadListType = 'text' | 'picture' | 'image-upload';

export interface UploadFile {
  uid: string;
  name: string;
  status?: UploadFileStatus;
  url?: string;
  thumbUrl?: string;
  percent?: number;
  originFileObj?: File;
  response?: unknown;
  error?: unknown;
  size?: number;
  type?: string;
}

export interface UploadListConfig {
  showPreviewIcon?: boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
}

export interface UploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onDrop'> {
  /** File list (controlled) */
  fileList?: UploadFile[];
  /** Default file list (uncontrolled) */
  defaultFileList?: UploadFile[];
  /** Callback when file list changes */
  onChange?: (info: { file: UploadFile; fileList: UploadFile[] }) => void;
  /** Callback before upload. Return false or Promise to prevent upload */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<File | Blob | boolean>;
  /** Custom upload function */
  customRequest?: (options: {
    file: File;
    onProgress: (event: { percent: number }) => void;
    onSuccess: (response: unknown, file: File) => void;
    onError: (error: Error, response?: unknown) => void;
  }) => void;
  /** Upload URL */
  action?: string;
  /** HTTP method */
  method?: 'post' | 'put' | 'patch';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request data */
  data?: Record<string, unknown> | ((file: File) => Record<string, unknown>);
  /** File name in request */
  name?: string;
  /** Whether to include cookies */
  withCredentials?: boolean;
  /** Accepted file types */
  accept?: string;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Maximum number of files */
  maxCount?: number;
  /** Maximum file size (bytes) */
  maxSize?: number;
  /** Drag and drop mode */
  drag?: boolean;
  /** Upload button text */
  children?: React.ReactNode;
  /** Custom upload button */
  customButton?: React.ReactNode;
  /** Button variant for default upload button */
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'upgrade';
  /** Button appearance for default upload button */
  buttonAppearance?: 'filled' | 'plain' | 'outline';
  /** List type */
  listType?: UploadListType;
  /** Whether to show upload list */
  showUploadList?: boolean | UploadListConfig;
  /** Callback when file is removed */
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  /** Callback when file preview is clicked */
  onPreview?: (file: UploadFile) => void;
  /** Callback when file download is clicked */
  onDownload?: (file: UploadFile) => void;
  /** Callback when file list is dropped */
  onDrop?: (e: React.DragEvent) => void;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface UploadComponent extends React.FC<UploadProps> {
  Dragger: React.FC<UploadProps>;
}
