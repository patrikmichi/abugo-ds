import React, { useState, useRef, useCallback, useMemo } from 'react';
import styles from './Upload.module.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Progress } from '@/components/Progress';

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
  response?: any;
  error?: any;
  size?: number;
  type?: string;
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
    onSuccess: (response: any, file: File) => void;
    onError: (error: Error, response?: any) => void;
  }) => void;
  /** Upload URL */
  action?: string;
  /** HTTP method */
  method?: 'post' | 'put' | 'patch';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request data */
  data?: Record<string, any> | ((file: File) => Record<string, any>);
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
  buttonVariant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'upgrade';
  /** Button appearance for default upload button */
  buttonAppearance?: 'filled' | 'plain' | 'outline';
  /** List type */
  listType?: UploadListType;
  /** Whether to show upload list */
  showUploadList?: boolean | {
    showPreviewIcon?: boolean;
    showRemoveIcon?: boolean;
    showDownloadIcon?: boolean;
  };
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

/**
 * Upload Component
 * 
 * File upload component with drag-and-drop support.
 * 
 * 
 * @example
 * ```tsx
 * <Upload
 *   action="/upload"
 *   onChange={(info) => console.log(info)}
 *   multiple
 * >
 *   <Button>Upload</Button>
 * </Upload>
 * ```
 */
export function Upload({
  fileList: controlledFileList,
  defaultFileList = [],
  onChange,
  beforeUpload,
  customRequest,
  action,
  method = 'post',
  headers,
  data,
  name = 'file',
  withCredentials = false,
  accept,
  multiple = false,
  maxCount,
  maxSize,
  drag = false,
  children,
  customButton,
  buttonVariant = 'tertiary',
  buttonAppearance = 'outline',
  listType = 'text',
  showUploadList = true,
  onRemove,
  onPreview,
  onDownload,
  onDrop,
  className,
  style,
  disabled,
  ...props
}: UploadProps) {
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>(defaultFileList);
  const [dragState, setDragState] = useState<'drag' | 'drop' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileIdCounter = useRef(0);

  const isControlled = controlledFileList !== undefined;
  const fileList = isControlled ? controlledFileList : internalFileList;

  const generateUid = useCallback(() => {
    return `upload-${Date.now()}-${++fileIdCounter.current}`;
  }, []);

  const updateFileList = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[]) => {
      const newFileList = updater(fileList);
      if (!isControlled) {
        setInternalFileList(newFileList);
      }
    },
    [fileList, isControlled]
  );

  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check maxCount
      if (maxCount && fileList.length + fileArray.length > maxCount) {
        const allowedFiles = fileArray.slice(0, maxCount - fileList.length);
        fileArray.splice(0, fileArray.length, ...allowedFiles);
      }

      // Check maxSize
      const validFiles = maxSize
        ? fileArray.filter((file) => {
            if (file.size > maxSize) {
              // Could show error notification here
              return false;
            }
            return true;
          })
        : fileArray;

      // Process beforeUpload
      const processedFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (beforeUpload) {
            try {
              const result = await beforeUpload(file, validFiles);
              if (result === false) {
                return null;
              }
              return result === true ? file : result;
            } catch (error) {
              return null;
            }
          }
          return file;
        })
      );

      const filesToUpload = processedFiles.filter((f): f is File | Blob => f !== null && f !== false);

      // Create UploadFile objects
      const newFiles: UploadFile[] = filesToUpload.map((file) => {
        const fileObj = file instanceof File ? file : new File([file], 'upload');
        return {
          uid: generateUid(),
          name: fileObj.name,
          status: 'uploading',
          percent: 0,
          originFileObj: fileObj,
          size: fileObj.size,
          type: fileObj.type,
        };
      });

      // Add to file list
      const updatedFileList = [...fileList, ...newFiles];
      updateFileList(() => updatedFileList);

      // Upload files
      newFiles.forEach((uploadFile) => {
        if (customRequest) {
          customRequest({
            file: uploadFile.originFileObj!,
            onProgress: (event) => {
              updateFileList((prev) =>
                prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, percent: event.percent, status: 'uploading' as UploadFileStatus }
                    : f
                )
              );
            },
            onSuccess: (response, file) => {
              updateFileList((prev) => {
                const updated = prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, status: 'done' as UploadFileStatus, percent: 100, response }
                    : f
                );
                onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
                return updated;
              });
            },
            onError: (error, response) => {
              updateFileList((prev) => {
                const updated = prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, status: 'error' as UploadFileStatus, error, response }
                    : f
                );
                onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
                return updated;
              });
            },
          });
        } else if (action) {
          // Default XHR upload
          const xhr = new XMLHttpRequest();
          const formData = new FormData();

          formData.append(name, uploadFile.originFileObj!);

          if (data) {
            const dataObj = typeof data === 'function' ? data(uploadFile.originFileObj!) : data;
            Object.keys(dataObj).forEach((key) => {
              formData.append(key, dataObj[key]);
            });
          }

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              updateFileList((prev) =>
                prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, percent, status: 'uploading' as UploadFileStatus }
                    : f
                )
              );
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              let response: any;
              try {
                response = JSON.parse(xhr.responseText);
              } catch {
                response = xhr.responseText;
              }
              updateFileList((prev) => {
                const updated = prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, status: 'done' as UploadFileStatus, percent: 100, response, url: response?.url }
                    : f
                );
                onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
                return updated;
              });
            } else {
              updateFileList((prev) => {
                const updated = prev.map((f) =>
                  f.uid === uploadFile.uid
                    ? { ...f, status: 'error' as UploadFileStatus, error: new Error('Upload failed') }
                    : f
                );
                onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
                return updated;
              });
            }
          });

          xhr.addEventListener('error', () => {
            updateFileList((prev) => {
              const updated = prev.map((f) =>
                f.uid === uploadFile.uid
                  ? { ...f, status: 'error' as UploadFileStatus, error: new Error('Network error') }
                  : f
              );
              onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
              return updated;
            });
          });

          xhr.open(method.toUpperCase(), action);
          if (headers) {
            Object.keys(headers).forEach((key) => {
              xhr.setRequestHeader(key, headers[key]);
            });
          }
          xhr.withCredentials = withCredentials;
          xhr.send(formData);
        } else {
          // No upload, just add to list
          updateFileList((prev) => {
            const updated = prev.map((f) =>
              f.uid === uploadFile.uid ? { ...f, status: 'done' as UploadFileStatus, percent: 100 } : f
            );
            onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
            return updated;
          });
        }
      });
    },
    [
      fileList,
      maxCount,
      maxSize,
      beforeUpload,
      customRequest,
      action,
      method,
      headers,
      data,
      name,
      withCredentials,
      generateUid,
      updateFileList,
      onChange,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e.target.files);
      // Reset input to allow selecting same file again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [handleFileChange]
  );

  const handleRemove = useCallback(
    async (file: UploadFile) => {
      if (onRemove) {
        const result = await onRemove(file);
        if (result === false) return;
      }

      updateFileList((prev) => {
        const updated = prev.filter((f) => f.uid !== file.uid);
        onChange?.({ file, fileList: updated });
        return updated;
      });
    },
    [onRemove, updateFileList, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('drag');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState(null);
      onDrop?.(e);
      handleFileChange(e.dataTransfer.files);
    },
    [onDrop, handleFileChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const showUploadListConfig = typeof showUploadList === 'object' ? showUploadList : { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false };

  const defaultButton = (
    <Button
      variant={buttonVariant}
      appearance={buttonAppearance}
      disabled={disabled}
    >
      <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault, styles.iconMarginRight)}>
        upload
      </span>
      Upload
    </Button>
  );

  const uploadButton = customButton || children || defaultButton;

  const uploadArea = (
    <div
      className={cn(
        styles.upload,
        drag && styles.drag,
        dragState && styles[dragState],
        disabled && styles.disabled,
        listType === 'image-upload' && styles.imageUpload,
        className
      )}
      style={style}
      onClick={!drag ? handleClick : undefined}
      onDragOver={drag ? handleDragOver : undefined}
      onDragLeave={drag ? handleDragLeave : undefined}
      onDrop={drag ? handleDrop : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        {...props}
      />
      {drag ? (
        <div className={styles.dragArea}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--token-component-upload-icon-color, #538bff)', marginBottom: '16px' }}>
            cloud_upload
          </span>
          <p className={styles.dragText}>Click or drag file to this area to upload</p>
          <p className={styles.dragHint}>Support for single or bulk upload</p>
        </div>
      ) : (
        uploadButton
      )}
    </div>
  );

  const renderFileList = () => {
    if (!showUploadList) return null;

    if (listType === 'picture' || listType === 'image-upload') {
      return (
        <div className={cn(styles.fileList, styles[listType])}>
          {fileList.map((file) => (
            <div key={file.uid} className={cn(styles.fileItem, styles[listType], file.status === 'error' && styles.error)}>
              {file.status === 'uploading' && (
                <div className={styles.progress}>
                  <Progress percent={file.percent || 0} size="small" />
                </div>
              )}
              <div className={styles.preview}>
                {file.thumbUrl || file.url ? (
                  <img src={file.thumbUrl || file.url} alt={file.name} />
                ) : (
                  <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconOpacity)}>
                    image
                  </span>
                )}
                {file.status === 'error' && (
                  <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconError)}>
                    error
                  </span>
                )}
              </div>
              {listType !== 'image-upload' && (
                <div className={styles.actions}>
                  {showUploadListConfig.showPreviewIcon && file.url && (
                    <button
                      type="button"
                      className={styles.action}
                      onClick={() => onPreview?.(file)}
                      aria-label="Preview"
                    >
                      <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
                        visibility
                      </span>
                    </button>
                  )}
                  {showUploadListConfig.showRemoveIcon && (
                    <button
                      type="button"
                      className={styles.action}
                      onClick={() => handleRemove(file)}
                      aria-label="Remove"
                    >
                      <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
                        delete
                      </span>
                    </button>
                  )}
                </div>
              )}
              {listType === 'image-upload' && showUploadListConfig.showRemoveIcon && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(file)}
                  aria-label="Remove"
                >
                  <span className={cn('material-symbols-outlined', styles.removeIcon)}>
                    close
                  </span>
                </button>
              )}
            </div>
          ))}
          {(!maxCount || fileList.length < maxCount) && (
            <div className={cn(styles.fileItem, styles[listType], styles.uploadTrigger)} onClick={handleClick}>
              {listType === 'image-upload' ? (
                <>
                  <span className={cn('material-symbols-outlined', styles.placeholderIcon)}>
                    image
                  </span>
                  <div className={styles.cameraBadge}>
                    <span className={cn('material-symbols-outlined', styles.cameraIcon)}>
                      camera_alt
                    </span>
                  </div>
                </>
              ) : (
                uploadButton
              )}
            </div>
          )}
        </div>
      );
    }

    // Text list
    return (
      <ul className={styles.fileList}>
        {fileList.map((file) => (
          <li key={file.uid} className={cn(styles.fileItem, file.status === 'error' && styles.error)}>
            <span className={styles.fileName}>
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)', marginRight: 'var(--token-primitive-spacing-2)' }}>
                {file.status === 'error' ? 'error' : file.status === 'uploading' ? 'hourglass_empty' : 'description'}
              </span>
              {file.name}
            </span>
            {file.status === 'uploading' && (
              <div className={styles.progressMargin}>
                <Progress percent={file.percent || 0} size="small" />
              </div>
            )}
            <div className={styles.actions}>
              {showUploadListConfig.showDownloadIcon && file.url && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => onDownload?.(file)}
                  aria-label="Download"
                >
                  <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
                    download
                  </span>
                </button>
              )}
              {showUploadListConfig.showPreviewIcon && file.url && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => onPreview?.(file)}
                  aria-label="Preview"
                >
                  <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
                    visibility
                  </span>
                </button>
              )}
              {showUploadListConfig.showRemoveIcon && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => handleRemove(file)}
                  aria-label="Remove"
                >
                  <span className={cn('material-symbols-outlined', styles.icon, styles.iconDefault)}>
                    delete
                  </span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.uploadWrapper}>
      {listType === 'image-upload' ? null : uploadArea}
      {renderFileList()}
    </div>
  );
}

/**
 * Upload Dragger Component
 * 
 * Drag-and-drop upload component.
 */
export function UploadDragger(props: UploadProps) {
  return <Upload {...props} drag />;
}

// Attach Dragger to Upload
(Upload as any).Dragger = UploadDragger;
