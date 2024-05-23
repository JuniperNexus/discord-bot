export const formatBytes = (bytes: number) => {
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];

    if (bytes === 0) return 'n/a';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};
