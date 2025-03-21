import { Backdrop, BackdropProps, CircularProgress } from '@mui/material';

const Loader = ({ open, sx }: BackdropProps) => {
    return (
        <Backdrop
            open={open || false}
            sx={{
                position: 'absolute',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#666',
                zIndex: theme => theme.zIndex.drawer + 1,
                ...sx,
            }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export { Loader };
