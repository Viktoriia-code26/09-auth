"use client";

import { createPortal } from "react-dom";
import React, { useEffect, useState } from "react";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  open: boolean;
}

export default function NoteModal({ onClose, children, open }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className={css.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
