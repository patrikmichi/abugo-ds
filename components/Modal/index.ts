import { Modal as ModalBase } from './Modal';
import { ModalStatic } from './ModalManager';
import type { ModalComponent } from './types';

// Attach static methods to Modal for convenience (Modal.info, Modal.confirm, etc.)
const Modal = ModalBase as ModalComponent;
Modal.info = ModalStatic.info;
Modal.success = ModalStatic.success;
Modal.error = ModalStatic.error;
Modal.warning = ModalStatic.warning;
Modal.confirm = ModalStatic.confirm;
Modal.destroyAll = ModalStatic.destroyAll;
Modal.config = ModalStatic.config;

export { Modal, ModalStatic };
export type { ModalProps, ConfirmOptions, ModalConfig, ModalComponent } from './types';
