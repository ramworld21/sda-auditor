import { EventEmitter } from '../../stencil-public-runtime';
export declare class DgaNavHeaderMain {
    collapsed: boolean;
    toggleCollapsed: EventEmitter<boolean>;
    isOpen: boolean;
    render(): any;
    handleToggle: () => void;
}
