import { useMemo } from 'react';

import { SearchChipType } from '../model/ChipType';

import { Chip, styled } from '@mui/material';

interface OwnProps {
    // value: [SearchChipType[],];
    value: [SearchChipType[], (setValue: SearchChipType[]) => void];
}

const StyledChip = styled(Chip)(() => ({
    backgroundColor: '#fff',
}));

const ChipList = ({ value }: OwnProps) => {
    const [propValue, setPropValue] = value;
    const searchList = useMemo(() => {
        return propValue || [];
    }, [propValue]);

    const handleDelete = ({ searchType, searchKeyword }: SearchChipType) => {
        const result = searchList.filter(
            item => item.searchType !== searchType || item.searchKeyword !== searchKeyword,
        );
        setPropValue(result);
    };
    return (
        <div className="chipList" style={{ display: 'flex', alignItems: 'center', gap: '0.2em' }}>
            {searchList &&
                searchList.map(({ searchType, searchKeyword }) => (
                    <StyledChip
                        key={`${searchType}_${searchKeyword}_${Math.random() * 999999999}`}
                        label={searchKeyword}
                        variant="filled"
                        onDelete={() => handleDelete({ searchType, searchKeyword })}
                        title={`${searchType} - ${searchKeyword}`}
                    />
                ))}
        </div>
    );
};

export { ChipList };
