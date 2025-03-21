import { TreeNodeProps } from './model/TreeViewModel';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ButtonBase, IconButton, Switch } from '@mui/material';

const TreeNode = ({
    node,
    hasChild,
    isOpen,
    depth,
    selectedItem,
    onToggle,
    onClickItem,
    onDoubleClick,
    onStateChange,
    openPopover,
    onDeleteItem,
    setItemToEdit,
}: TreeNodeProps) => {
    return (
        <div
            className={`treeItem ${isOpen ? 'is-open' : ''}`}
            style={
                {
                    '--depth': depth,
                } as React.CSSProperties
            }
        >
            <IconButton
                className={`expandBtn ${!hasChild && 'is-hide'}`}
                size="small"
                onClick={e => {
                    e.stopPropagation();
                    onToggle(node.id);
                }}
            >
                {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>

            <ButtonBase
                component="div"
                title={node.text}
                disableRipple
                className={`itemWrap ${selectedItem?.seq === node.id && 'is-selected'}`}
                onClick={() => onClickItem(node)}
                onDoubleClick={e => onDoubleClick(e, node)}
            >
                <div className="textWrap">
                    {isOpen ? (
                        <FolderOpenIcon className="folderIcon" />
                    ) : (
                        <FolderIcon className="folderIcon" />
                    )}
                    <span className="name">{node.text}</span>
                </div>

                <div className="functionWrap">
                    <div className="btnWrap">
                        <IconButton
                            id={node.text}
                            name="addBtn"
                            aria-label="add"
                            size="small"
                            onClick={e => {
                                setItemToEdit(null);
                                openPopover(e, node);
                            }}
                            onDoubleClick={e => e.stopPropagation()}
                        >
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={e => onDeleteItem(e, node)}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </div>

                    {/* 사용여부 스위치 */}
                    {node.state && (
                        <div className="switchWrap">
                            <Switch
                                size="small"
                                color="default"
                                checked={node.state === 'Y'}
                                onClick={e => e.stopPropagation()}
                                onChange={e => onStateChange(e, node)}
                            />
                        </div>
                    )}
                </div>
            </ButtonBase>
        </div>
    );
};

export { TreeNode };
