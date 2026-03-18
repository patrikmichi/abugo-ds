import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import styles from './Upload.module.css';
import UploadFileList from './UploadFileList';
import type { UploadProps, UploadFile, UploadFileStatus, UploadComponent, UploadListConfig } from './types';

let fileIdCounter = 0;
const generateUid = () => `upload-${Date.now()}-${++fileIdCounter}`;

const Upload = ({
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
  buttonVariant = 'secondary',
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
}: UploadProps) => {
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>(defaultFileList);
  const [dragState, setDragState] = useState<'drag' | 'drop' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledFileList !== undefined;
  const fileList = isControlled ? controlledFileList : internalFileList;

  const updateFileList = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[]) => {
      const newFileList = updater(fileList);
      if (!isControlled) {
        setInternalFileList(newFileList);
      }
    },
    [fileList, isControlled]
  );

  const uploadFile = useCallback(
    (uploadFile: UploadFile) => {
      if (customRequest) {
        customRequest({
          file: uploadFile.originFileObj!,
          onProgress: (event) => {
            updateFileList((prev) =>
              prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, percent: event.percent, status: 'uploading' as UploadFileStatus } : f
              )
            );
          },
          onSuccess: (response) => {
            updateFileList((prev) => {
              const updated = prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'done' as UploadFileStatus, percent: 100, response } : f
              );
              onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
              return updated;
            });
          },
          onError: (error, response) => {
            updateFileList((prev) => {
              const updated = prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'error' as UploadFileStatus, error, response } : f
              );
              onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
              return updated;
            });
          },
        });
      } else if (action) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append(name, uploadFile.originFileObj!);

        if (data) {
          const dataObj = typeof data === 'function' ? data(uploadFile.originFileObj!) : data;
          Object.keys(dataObj).forEach((key) => {
            formData.append(key, String(dataObj[key]));
          });
        }

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            updateFileList((prev) =>
              prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, percent, status: 'uploading' as UploadFileStatus } : f
              )
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            let response: unknown;
            try {
              response = JSON.parse(xhr.responseText);
            } catch {
              response = xhr.responseText;
            }
            updateFileList((prev) => {
              const updated = prev.map((f) =>
                f.uid === uploadFile.uid
                  ? { ...f, status: 'done' as UploadFileStatus, percent: 100, response, url: (response as { url?: string })?.url }
                  : f
              );
              onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
              return updated;
            });
          } else {
            updateFileList((prev) => {
              const updated = prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'error' as UploadFileStatus, error: new Error('Upload failed') } : f
              );
              onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
              return updated;
            });
          }
        });

        xhr.addEventListener('error', () => {
          updateFileList((prev) => {
            const updated = prev.map((f) =>
              f.uid === uploadFile.uid ? { ...f, status: 'error' as UploadFileStatus, error: new Error('Network error') } : f
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
        updateFileList((prev) => {
          const updated = prev.map((f) =>
            f.uid === uploadFile.uid ? { ...f, status: 'done' as UploadFileStatus, percent: 100 } : f
          );
          onChange?.({ file: updated.find((f) => f.uid === uploadFile.uid)!, fileList: updated });
          return updated;
        });
      }
    },
    [customRequest, action, method, headers, data, name, withCredentials, updateFileList, onChange]
  );

  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      let fileArray = Array.from(files);

      // Check maxCount
      if (maxCount && fileList.length + fileArray.length > maxCount) {
        fileArray = fileArray.slice(0, maxCount - fileList.length);
      }

      // Check maxSize
      const validFiles = maxSize ? fileArray.filter((file) => file.size <= maxSize) : fileArray;

      // Process beforeUpload
      const processedFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (beforeUpload) {
            try {
              const result = await beforeUpload(file, validFiles);
              if (result === false) return null;
              return result === true ? file : result;
            } catch {
              return null;
            }
          }
          return file;
        })
      );

      const filesToUpload = processedFiles.filter((f): f is File | Blob => f !== null);

      const newFiles: UploadFile[] = filesToUpload.map((file) => {
        const fileObj = file instanceof File ? file : new File([file], 'upload');
        return {
          uid: generateUid(),
          name: fileObj.name,
          status: 'uploading' as UploadFileStatus,
          percent: 0,
          originFileObj: fileObj,
          size: fileObj.size,
          type: fileObj.type,
        };
      });

      const updatedFileList = [...fileList, ...newFiles];
      updateFileList(() => updatedFileList);

      newFiles.forEach(uploadFile);
    },
    [fileList, maxCount, maxSize, beforeUpload, updateFileList, uploadFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e.target.files);
      if (inputRef.current) inputRef.current.value = '';
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
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const showUploadListConfig: UploadListConfig =
    typeof showUploadList === 'object'
      ? showUploadList
      : { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false };

  const defaultButton = (
    <Button variant={buttonVariant} appearance={buttonAppearance} disabled={disabled}>
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

  return (
    <div className={styles.uploadWrapper}>
      {listType !== 'image-upload' && uploadArea}
      {showUploadList && (
        <UploadFileList
          fileList={fileList}
          listType={listType}
          showUploadListConfig={showUploadListConfig}
          maxCount={maxCount}
          onRemove={handleRemove}
          onPreview={onPreview}
          onDownload={onDownload}
          onTriggerClick={handleClick}
          uploadButton={uploadButton}
        />
      )}
    </div>
  );
};

const UploadDragger = (props: UploadProps) => <Upload {...props} drag />;

Upload.Dragger = UploadDragger;

export default Upload as UploadComponent;
