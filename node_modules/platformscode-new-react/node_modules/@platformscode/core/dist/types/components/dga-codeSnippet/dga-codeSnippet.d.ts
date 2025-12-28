export declare class CodeSnippet {
    snippets: {
        [key: string]: string;
    };
    showButton: boolean;
    type: 'multi-line' | 'single';
    showSidebar: boolean;
    showTabList: boolean;
    showMore: boolean;
    activeTab: string;
    componentDidLoad(): void;
    private handleTabClick;
    private handleCopy;
    private renderWithLineNumbers;
    render(): any;
}
