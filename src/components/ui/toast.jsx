import * as React from "react"
import { cn } from "@/lib/utils"
import { X, Check, Info, AlertTriangle, Copy } from "lucide-react"

const ToastContext = React.createContext({})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 4000)
    
    return id
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = React.useCallback((options) => {
    if (typeof options === 'string') {
      return addToast({ title: options, type: 'info' })
    }
    return addToast(options)
  }, [addToast])

  toast.success = React.useCallback((title, description) => {
    return addToast({ title, description, type: 'success' })
  }, [addToast])

  toast.error = React.useCallback((title, description) => {
    return addToast({ title, description, type: 'error' })
  }, [addToast])

  toast.info = React.useCallback((title, description) => {
    return addToast({ title, description, type: 'info' })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return "border-green-200 bg-green-50"
      case 'error':
        return "border-red-200 bg-red-50"
      case 'info':
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className={cn(
      "animate-in slide-in-from-right duration-300 ease-out",
      "border rounded-lg p-4 shadow-lg bg-white",
      "flex items-start gap-3 min-w-[320px]",
      getTypeStyles()
    )}>
      {getIcon()}
      <div className="flex-1 space-y-1">
        <div className="font-medium text-sm">{toast.title}</div>
        {toast.description && (
          <div className="text-xs text-gray-600">{toast.description}</div>
        )}
        {toast.action && (
          <div className="mt-2">
            {toast.action}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}