/**
 * Loads the Kurokane font from a specified URL or from localStorage.
 * If the font is successfully loaded, it adds the 'kurokane-loaded'
 * class to the document's root element.
 */
export async function loadKurokaneFont(): Promise<void> {
    const fontUrl = (window as unknown as { __KUROKANE_FONT_URL__?: string }).__KUROKANE_FONT_URL__
        || localStorage.getItem('kurokaneFontUrl')
        || '/assets/fonts/Kurokane.woff2';

    if (!fontUrl || !('FontFace' in window) || !document.fonts) return;

    try {
        const kurokaneFace = new FontFace('Kurokane', `url(${fontUrl})`);
        const loadedFace = await kurokaneFace.load();
        document.fonts.add(loadedFace);
        document.documentElement.classList.add('kurokane-loaded');
    } catch (error) {
        console.warn('Failed to load Kurokane font:', error);
    }
}