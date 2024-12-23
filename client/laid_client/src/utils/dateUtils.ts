export const formatDate = (timestamp: number) => {
  const milliseconds = timestamp * 1000;
  const date = new Date(milliseconds);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};