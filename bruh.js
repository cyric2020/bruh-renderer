// Loop through each image and check its file extension
function getBruhs() {
    var bruhImages = document.getElementsByTagName('img');
    for (var i = 0; i < bruhImages.length; i++) {
        var bruhImage = bruhImages[i];
        var imageType = bruhImage.src.split('.');
        imageType = imageType[imageType.length - 1];
        if (imageType.toLowerCase() == 'bruh') {
            renderImage(bruhImage);
        }
    }
}

function hexToRgb(hex) {
    // convert a hex code to rgb
    var r = parseInt(hex.substr(0, 2), 16);
    var g = parseInt(hex.substr(2, 2), 16);
    var b = parseInt(hex.substr(4, 2), 16);
    return { r: r, g: g, b: b };
}

function renderImage(imageDom) {
    // Get the binary/text data from the image
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageDom.src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        // the first 4 bytes of the image is the width
        var width = new Uint32Array(this.response, 0, 1)[0];
        // the next 4 bytes is the height
        var height = new Uint32Array(this.response, 4, 1)[0];

        // Create a canvas in place of the image
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // apply all classes from the image to the canvas
        canvas.className = imageDom.className;

        // Remove the first 8 bytes from the image data
        var imageData = new Uint8Array(this.response, 8);
        // convert the image data to text
        var imageText = '';
        for (var i = 0; i < imageData.length; i++) {
            imageText += String.fromCharCode(imageData[i]);
        }

        // loop through each line in the imageText
        var lines = imageText.split('\n');
        for (var i = 0; i < lines.length; i++) {
            // every 6 characters is a hex code
            var line = lines[i];
            for (var j = 0; j < line.length; j += 6) {
                // get the hex code
                var hex = line.substr(j, 6);
                // convert it to rgb
                var rgb = hexToRgb(hex);
                // console.log(rgb);

                // draw a pixel on the canvas
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                ctx.fillRect(j / 6, i, 1, 1);
            }
        }

        // Convert the canvas to a data url
        var dataUrl = canvas.toDataURL();
        // Set the image src to the data url
        imageDom.src = dataUrl;
    }
    xhr.send();
}

window.onload = () => {
    // dom update event listener
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == 'childList' || mutation.attributeName == 'src') {
                getBruhs();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
    getBruhs();

    document.getElementById('test').src = './image.bruh'
}