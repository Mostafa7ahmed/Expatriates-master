import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, newsTitle, isLoading }) => {
  const { t } = useTranslation("News");
  
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t("delete.confirm.title")}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p>{t("delete.confirm.message")}</p>
          <div className="news-title-preview">
            "{newsTitle}"
          </div>
          <p>{t("delete.confirm.warning")}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            {t("delete.confirm.buttons.cancel")}
          </button>
          <button 
            className="btn-delete" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t("delete.confirm.buttons.deleting") : t("delete.confirm.buttons.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 