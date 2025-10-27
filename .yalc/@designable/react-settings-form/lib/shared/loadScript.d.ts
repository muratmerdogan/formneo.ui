export interface ILoadScriptProps {
    package: string;
    entry: string;
    root: string;
    base?: string;
}
export declare const loadScript: (props: ILoadScriptProps) => Promise<any>;
