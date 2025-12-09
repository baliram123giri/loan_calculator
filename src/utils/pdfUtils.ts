import jsPDF from 'jspdf';

/**
 * Loads a Unicode-compatible font (Noto Sans) into the jsPDF document.
 * This is required to render currency symbols like ₹, ₦, ₵ correctly.
 * 
 * @param doc The jsPDF document instance
 */
export const loadUnicodeFont = async (doc: jsPDF): Promise<void> => {
    try {
        // Using raw GitHub URL to ensure we get a standard static TTF file
        const fontUrl = 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf';
        const response = await fetch(fontUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch font: ${response.statusText}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();

        await new Promise((resolve, reject) => {
            reader.onloadend = () => {
                if (!reader.result) {
                    reject(new Error('Failed to read font file'));
                    return;
                }
                const base64data = reader.result as string;
                // Remove "data:font/ttf;base64," prefix if present
                const base64Content = base64data.split(',')[1] || base64data;

                if (base64Content) {
                    doc.addFileToVFS('NotoSans-Regular.ttf', base64Content);
                    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
                    // We DO NOT set the font globally here, allowing the user to apply it selectively
                }
                resolve(null);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Failed to load Unicode font, symbols may not render correctly:', error);
    }
};
