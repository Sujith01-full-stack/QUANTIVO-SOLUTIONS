import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export default function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={5} {...props} />
    </div>
  )
}
