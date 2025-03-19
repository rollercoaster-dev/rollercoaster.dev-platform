import { ref, readonly } from 'vue'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

type ToastProps = Omit<Toast, 'id'>

const TOAST_REMOVE_DELAY = 1000

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).slice(2, 11)
    const newToast: Toast = {
      id,
      title: props.title,
      description: props.description,
      variant: props.variant || 'default',
      duration: props.duration || 5000,
    }

    toasts.value = [...toasts.value, newToast]

    setTimeout(() => {
      dismiss(id)
    }, newToast.duration)

    return id
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const dismissAll = () => {
    toasts.value = []
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts: readonly(toasts),
  }
}
