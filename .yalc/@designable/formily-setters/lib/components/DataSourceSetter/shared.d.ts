import { IDataSourceItem, INodeItem } from './types';
export interface INode {
    key?: string;
    map?: any;
    children?: INode[];
}
export declare const traverseTree: <T extends INode>(data: T[], callback: (dataItem: T, i: number, data: T[]) => any) => void;
export declare const transformValueToData: (value: IDataSourceItem[]) => INodeItem[];
export declare const transformDataToValue: (data: INodeItem[]) => IDataSourceItem[];
