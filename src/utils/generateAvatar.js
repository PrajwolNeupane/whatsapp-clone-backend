export default function generateAvatarUrl(
    firstName
) {
    // Function to generate a random hex color
    function getRandomColor() {
        return Math.floor(Math.random() * 16777215).toString(16);
    }

    // Function to get the contrast color (black or white) based on the background color
    function getContrastColor(hexColor) {
        // Hex to RGB
        let r = parseInt(hexColor.substr(1, 2), 16);
        let g = parseInt(hexColor.substr(3, 2), 16);
        let b = parseInt(hexColor.substr(5, 2), 16);

        // Compute the relative luminance
        let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Choose black or white depending on luminance
        return luminance > 0.5 ? "000000" : "ffffff";
    }

    // Generate random background color
    const bgColor = getRandomColor();

    // Get contrast text color
    const textColor = getContrastColor(bgColor);

    // Construct the URL
    const url = `https://ui-avatars.com/api/?color=${textColor}&background=${bgColor}&name=${firstName}&size=150&font-size=0.25`;

    return url;
}