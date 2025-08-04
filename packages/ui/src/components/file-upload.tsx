import * as React from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@bytebank/ui/lib/utils";
import { Button } from "./button.js";

interface FileUploadProps {
  className?: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number; // em MB
  placeholder?: string;
  value?: File | null;
  disabled?: boolean;
  error?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      onFileSelect,
      acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize = 5, // 5MB por padrão
      placeholder = "Clique para selecionar ou arraste um arquivo",
      value,
      disabled = false,
      error,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Usar ref interno se nenhum ref externo for fornecido
    const fileInputRef = ref || inputRef;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      validateAndSelectFile(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files?.[0] || null;
      validateAndSelectFile(file);
    };

    const validateAndSelectFile = (file: File | null) => {
      if (!file) {
        onFileSelect(null);
        return;
      }

      // Validar tipo de arquivo
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        alert(
          `Tipo de arquivo não permitido. Tipos aceitos: ${acceptedTypes.join(", ")}`
        );
        return;
      }

      // Validar tamanho
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        alert(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
        return;
      }

      onFileSelect(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleClick = () => {
      if (typeof fileInputRef === "object" && fileInputRef?.current) {
        fileInputRef.current.click();
      }
    };

    const handleRemoveFile = (event: React.MouseEvent) => {
      event.stopPropagation();
      onFileSelect(null);
      if (typeof fileInputRef === "object" && fileInputRef?.current) {
        fileInputRef.current.value = "";
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className="space-y-2">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-destructive",
            className
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={disabled ? undefined : handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
            {...props}
          />

          {value ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {value.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(value.size)}
                  </p>
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {placeholder}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tipos aceitos: {acceptedTypes.join(", ")} (máx. {maxSize}MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
