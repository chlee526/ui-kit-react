import React, { useCallback, useEffect, useState } from 'react';

import { searchBarStyle } from './Treeview.style';
import { SearchBar } from '../searchBar/SearchBar';
import { TreeSearchBarProps } from './model/TreeViewModel';

import { InputBoxDefaultProps, SearchChipType } from '../../main';

import AddIcon from '@mui/icons-material/Add';
import { IconButton, Stack } from '@mui/material';

const TreeSearchBar = ({ setPopoverData, handleSearchTreeView, rootWidth }: TreeSearchBarProps) => {
    const [searchInput, setSearchInput] = useState<SearchChipType>({ searchKeyword: '' });
    // 팝오버 오픈
    const handleOpenPopover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setPopoverData(prev =>
            prev.anchorElm
                ? {
                      anchorElm: null,
                      node: null,
                  }
                : { anchorElm: e.currentTarget, node: null },
        );
    }, []);

    useEffect(() => {
        handleSearchTreeView(searchInput.searchKeyword);
    }, [searchInput]);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            css={searchBarStyle}
        >
            <div className="searchBarWrap">
                <SearchBar
                    value={[searchInput, setSearchInput]}
                    sx={{ width: '100%' }}
                    inputProps={
                        { sx: { width: `calc(${rootWidth}px - 114px )` } } as InputBoxDefaultProps
                    }
                    size="small"
                />
            </div>
            <div className="btnWrap">
                <IconButton onClick={handleOpenPopover}>
                    <AddIcon fontSize="inherit" />
                </IconButton>
            </div>
        </Stack>
    );
};

export { TreeSearchBar };
