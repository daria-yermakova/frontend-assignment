export type FileType = 'image' | 'doc' | 'folder';

export default interface Item {
    id: string;
    name: string;
    type: FileType;
    children?: Item[];
}