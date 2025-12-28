export declare class DgaFileUpload {
    id: string;
    name: string;
    accept: string;
    multiple: boolean;
    title: string;
    fileTypesText: string;
    actionName: string;
    maximumFilesSize?: number;
    disabled?: boolean;
    getUploadedFile?: (files: {
        name: string;
        uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
        progress?: number;
        errorMessage?: string;
    }[]) => void;
    uploadFileOverSize?: () => void;
    onChange?: (event: Event) => void;
    emitDeleteFile?: (file: {
        name: string;
        uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
        progress?: number;
        errorMessage?: string;
    }, index: number) => void;
    files: {
        name: string;
        uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
        progress?: number;
        errorMessage?: string;
    }[];
    dragState: boolean;
    private fileInputRef;
    handleFileSelection: (event: Event) => void;
    handleDrop: (event: DragEvent) => void;
    addDragOverClass: (event: DragEvent) => void;
    removeDragOverClass: (event: DragEvent) => void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    handleDeleteFile(index: number, file: {
        name: string;
        uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
        progress?: number;
        errorMessage?: string;
    }): void;
    renderFile(file: {
        name: string;
        uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
        progress?: number;
        errorMessage?: string;
    }, index: number): any;
    render(): any;
}
