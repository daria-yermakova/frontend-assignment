import React, { useState, useCallback } from "react";
import Item, {FileType} from "../models/Item";
import {SimpleTreeView, TreeItem, useTreeViewApiRef} from "@mui/x-tree-view";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import FolderRounded from "@mui/icons-material/FolderRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ap} from "vitest/dist/reporters-5f784f42";

const getIconFromFileType = (fileType: FileType) => {
    switch (fileType) {
        case 'image':
            return <ImageIcon />;
        case 'doc':
            return <ArticleIcon />;
        case 'folder':
            return <FolderRounded />;
        default:
            return <ArticleIcon />;
    }
};


export const Main = ({fileArray} : { fileArray : Item []}) => {

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);


    const onItemClick = useCallback((e: React.MouseEvent, itemId: string) => {
        const finded = findItem(fileArray, itemId)
        if(finded){
            setSelectedItem(finded);
        }
        }, [fileArray]);


    const findItem = useCallback((listItems: Item[], id: string): Item | undefined => {
        let finded = undefined;  listItems.some(item => {
            if (item.id === id) {
                finded = item;
                return true;    }
            if (!item.children) {
                return false;
            } else if (item.children) {
                finded = findItem(item.children, id);
                if (!finded) {        return false;
                }      return true;
            }  });
        return finded;
    }, [])

    const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of 300px
    const [isResizing, setIsResizing] = useState(false); // To track if resizing is in progress

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const resizeSidebar = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = Math.max(300, e.clientX); // Minimum width of 300px
            setSidebarWidth(newWidth);
        }
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resizeSidebar);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resizeSidebar);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resizeSidebar);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    const buildTreeItem = (item: Item) => {
        if(item.children !== null && item.children?.length !== undefined) {
            return (<TreeItem itemId={item.id} label={item.name}>
                {item.children.map(child => buildTreeItem(child))}
            </TreeItem>);
        } else {
            return (<TreeItem itemId={item.id} label={item.name}/>);
        }
    }

    const handleClick = useCallback((e: React.SyntheticEvent, item: Item) => {
        if(apiRef.current) {
            apiRef.current.setItemExpansion(
                e,
                item.id,
                true
            );
            apiRef.current.focusItem(
                e,
                item.id
            );
            setSelectedItem(item);
        }
    }, []);

    const buildItemInfo = (item: Item) => {
        console.log(item, typeof item)
        if(item) {
            if(item.type !== 'folder') {
                return (
                    <Box sx={{ padding:"10px"}}>
                        <Typography fontFamily={'inherit'} variant="h6">Preview</Typography>
                        <Typography>{`File name: ${item.name}`}</Typography>
                        <Typography>{`File type: ${item.type}`}</Typography>
                    </Box>
                );
            } else {
                if(item.children) {
                    const itemsArray: any[] = [];
                    for(let i= 0; i < item.children.length; i++) {
                        itemsArray.push(
                            <Box sx={{ textAlign: "center", padding: "5px", flexBasis: '18%', paddingY: 2, minWidth: '136px'}}
                             onClick={(e) => {
                                if(item.children && item.children[i]) {
                                    handleClick(e, item.children[i])
                                }
                            }}>
                                {getIconFromFileType(item.children[i].type)}
                                <Typography>{item.children[i].name}</Typography>
                            </Box>
                        )
                    }
                    return (
                        <Box sx={{display: "flex", flexWrap: 'wrap'}}>
                            {!itemsArray.length ?
                                <Typography sx={{ padding:"10px"}} fontFamily={'inherit'} variant="h6">No items</Typography>
                                : itemsArray}
                        </Box>
                    );
                }
            }
        }
    }

    const apiRef = useTreeViewApiRef();

    return (
        <Box display={"flex"} overflow={"hidden"} height={"100%"} flexGrow={1}>
            <Box minWidth={300}
                 width={`${sidebarWidth}px`}
                 pl={3} py={4}
                 overflow={"auto"}
                 sx={{position: "relative", borderRight: "1px solid #000"}}
                 onMouseDown={startResizing}
            >
                <SimpleTreeView onItemClick={onItemClick} apiRef={apiRef}>
                    {fileArray.map((item : Item) =>
                            buildTreeItem(item)
                        )}
                </SimpleTreeView>
            </Box>
            <Box sx={{ flexGrow: 1}}>
                {selectedItem ? buildItemInfo(selectedItem) :
                    <Box sx={{ padding:"10px"}}>
                        <Typography fontFamily={'inherit'} variant="h6">No information</Typography>
                    </Box> }
            </Box>
        </Box>

    );
}