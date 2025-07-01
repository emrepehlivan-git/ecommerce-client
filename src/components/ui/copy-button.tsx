import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import React, { useState } from "react"
import { Hint } from "./hint"

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, className = "", label = "Copy" }) => {
  const [isCopied, setIsCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(value)
        setIsCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
  }

  return (
    <Hint label={isCopied ? "Copied" : "Copy"}>    
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleCopy}
      title={label}
    >
      {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </Hint>
  )
} 