export default function getWindowDimensions() {
    
    const { innerWidth: width, innerHeight: height } = window;

    const isMobile = (width < 500);

    const isTablet = (width > 500 && width < 927);

    const isWeb = (width > 927);

    return {
        width,
        height,
        isMobile,
        isTablet,
        isWeb
    };
}