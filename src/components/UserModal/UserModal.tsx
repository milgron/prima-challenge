import { useCallback, useEffect, useRef } from "react";
import type { User } from "../../types/user";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import "./UserModal.css";

export interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (!isOpen && previousActiveElement.current) {
      (previousActiveElement.current as HTMLElement).focus?.();
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="user-modal__backdrop" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className="user-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Badge role={user.role} />

        <h2 id="modal-title" className="user-modal__name">
          {user.name}
        </h2>

        <p className="user-modal__job-title">{user.jobTitle}</p>

        <div className="user-modal__info">
          <span className="user-modal__label">Team:</span>
          <span className="user-modal__value">{user.team}</span>
        </div>

        <div className="user-modal__info">
          <span className="user-modal__label">Contact information:</span>
          <a href={`mailto:${user.email}`} className="user-modal__email">
            {user.email}
          </a>
        </div>

        <div className="user-modal__details">
          <span className="user-modal__label">Other details:</span>
          <p className="user-modal__details-text">{user.details}</p>
        </div>

        <Button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close modal"
          className="user-modal__close-button"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
