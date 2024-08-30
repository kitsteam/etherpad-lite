function initialize_qrcode() {
    console.log('initialize_qrcode')
    document.getElementById("embedreadonly").addEventListener('change', (changeEvent) => { 
      generate_qrcode();
      return true;
    });

    generate_qrcode()
}

function generate_qrcode() {
    const url = document.getElementById("linkinput").value || window.location.href;
    const qrCodeDiv = document.getElementById("qrcode");
    const width = 200;
    const height = 200;

    // clear old code:
    qrCodeDiv.innerHTML = '';

    createQrCode(qrCodeDiv, url, width, height)
} 

function qrCodeOptions(url, width, height) {
     return {
        width: width,
        height: height,
        type: "svg",
        data: url,
        image: "",
        dotsOptions: {
            color: '#000000',
            type: 'dots',
        },
        cornersSquareOptions: {
            type: 'square'
        },
        cornersDotOptions: {
            type: 'dot'
        },
        backgroundOptions: {
            color: "#fff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 0,
        },    
    }
  }

function createQrCode(qrCodeDiv, url, width, height) {
    const canvas = document.createElement('div');
    qrCodeDiv.appendChild(canvas);

    let qrCode = new QRCodeStyling(qrCodeOptions(url, width, height));
    qrCode.append(canvas);
    const downloadButton = addDownloadButton(qrCode);
    
    qrCodeDiv.appendChild(downloadButton);
  
    return qrCode   
}

function addDownloadButton(qrCode) {
  const downloadButton = document.createElement('button');
  downloadButton.id = 'qr-code-download';
  downloadButton.textContent = 'Download';

  downloadButton.addEventListener('click', function(clickEvent) {
        qrCode.download({ name: "qr", extension: 'png' });
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        return false;
  })
  return downloadButton;
}

