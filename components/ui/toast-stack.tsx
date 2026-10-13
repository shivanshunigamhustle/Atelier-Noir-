"use client";

import { useStore } from "@/lib/store-context";
import { Check } from "@phosphor-icons/react";

export function ToastStack() {
  const { state, dispatch } = useStore();

  if (state.toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4">
      {state.toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-center gap-3 border border-charcoal bg-ivory px-5 py-3 shadow-[0_8px_24px_rgba(36,36,32,0.14)] animate-[toast-in_200ms_ease-out]"
        >
          <Check size={16} weight="bold" className="shrink-0 text-olive" />
          <span className="text-sm text-charcoal">{t.message}</span>
          {t.actionLabel && t.onAction && (
            <button
              onClick={() => {
                t.onAction?.();
                dispatch({ type: "DISMISS_TOAST", id: t.id });
              }}
              className="ml-2 text-sm font-medium underline underline-offset-4"
            >
              {t.actionLabel}
            </button>
          )}
          <button
            onClick={() => dispatch({ type: "DISMISS_TOAST", id: t.id })}
            aria-label="Dismiss notification"
            className="ml-1 text-charcoal/50 hover:text-charcoal"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
