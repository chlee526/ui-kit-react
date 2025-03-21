import { useMemo } from 'react';

import { TreeDialogProps } from './model/TreeViewModel';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const TreeDialog = <Confirm,>({
    dialogData,
    closeDialog,
    confirmEvent,
}: TreeDialogProps<Confirm>) => {
    const isDialogOpen = useMemo(() => {
        return dialogData?.open;
    }, [dialogData]);

    return (
        <Dialog
            disableRestoreFocus // 다이얼로그 닫힐때 포커스 에러 방지
            open={isDialogOpen || false}
            onClose={closeDialog}
        >
            {dialogData?.contents && isDialogOpen && (
                <>
                    <DialogTitle>{dialogData.contents?.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{dialogData.contents?.content}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                closeDialog();
                                confirmEvent();
                            }}
                        >
                            예
                        </Button>
                        <Button onClick={closeDialog}>아니요</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export { TreeDialog };
