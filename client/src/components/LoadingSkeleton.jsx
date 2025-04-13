import { Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ type = 'task', count = 3 }) => {
  const items = Array(count).fill(0);

  if (type === 'task') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((_, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Skeleton variant="text" width="80%" height={20} />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={80} height={24} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'note') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((_, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Skeleton variant="text" width="70%" height={28} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Skeleton variant="rounded" width={100} height={36} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton; 