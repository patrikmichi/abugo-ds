import { cn } from '@/lib/utils';
import { Progress } from '@/components/Progress';
import styles from './Upload.module.css';
import type { UploadFile, UploadListType, UploadListConfig } from './types';

interface UploadFileListProps {
  fileList: UploadFile[];
  listType: UploadListType;
  showUploadListConfig: UploadListConfig;
  maxCount?: number;
  onRemove: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  onTriggerClick: () => void;
  uploadButton: React.ReactNode;
}

const UploadFileList = ({
  fileList,
  listType,
  showUploadListConfig,
  maxCount,
  onRemove,
  onPreview,
  onDownload,
  onTriggerClick,
  uploadButton,
}: UploadFileListProps) => {
  if (listType === 'picture' || listType === 'image-upload') {
    return (
      <div className={cn(styles.fileList, styles[listType])}>
        {fileList.map((file) => (
          <div key={file.uid} className={cn(styles.fileItem, styles[listType], file.status === 'error' && styles.error)}>
            {file.status === 'uploading' && (
              <div className={styles.progress}>
                <Progress value={file.percent || 0} />
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
                    onClick={() => onRemove(file)}
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
                onClick={() => onRemove(file)}
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
          <div className={cn(styles.fileItem, styles[listType], styles.uploadTrigger)} onClick={onTriggerClick}>
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
              <Progress value={file.percent || 0} />
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
                onClick={() => onRemove(file)}
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

export default UploadFileList;
