const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext("2d");

const image = new Image();
image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png";

image.addEventListener("load", function() {
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // rgba of each pixel
    const rgba = [];
    for (let i = 0; i < imageData.length / 4; i += 4) {
        rgba.push({r: imageData[i], g: imageData[i+1], b: imageData[i+2], a: imageData[i+3]});
    }
    
    console.log(rgba);
    
    // {r, g, b, a}[]
    const uniqueRgba = [];
    rgba.forEach(color => {
        const existingIndex = uniqueRgba.findIndex(uniqueCol => {return color.r === uniqueCol.r && color.g === uniqueCol.g && uniqueCol.b === color.b && uniqueCol.a === color.a});
        if (existingIndex < 0) uniqueRgba.push(color);
    });
    
    // index of uniqueRgba
    const pixelColorMap = [];
    rgba.forEach(color => {
        const index = uniqueRgba.findIndex(unique => {
            return unique.r === color.r && unique.g === color.g && unique.b === color.b && unique.a === color.a;
        });
        pixelColorMap.push(index);
    });
    
    
    console.log(uniqueRgba);
    console.log(pixelColorMap);
});
