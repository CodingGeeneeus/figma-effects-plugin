
export const getImageFromFile = (file) => {
    const _Image = new Image();
    const reader = new FileReader();

    if (file) {
	reader.readAsDataURL(file);
    };

    reader.addEventListener('load', () => {
	console.log(reader.result)
	_Image.src= reader.result;
    });



    return _Image
}

export const blobToPNG = (blob:Blob):Promise<HTMLImageElement> => {
    return new Promise(resolve => {
	const url = URL.createObjectURL(blob);
	let image = new Image();
	image.onload = () => {
	    URL.revokeObjectURL(url);
	    resolve(image);
	}
	image.src = url
    })
}

export const getImageFromUint8 = async (selection:Uint8Array[]) => {
    const blob = new Blob([selection as unknown as BlobPart], {type: "image/png"})
    const image = await blobToPNG(blob);

    return image
}

export const resizeWin = (width:number, height:number):void => {
    parent.postMessage({pluginMessage: {
	type: 'resize',
	width: width,
	height: height
    }}, '*')
}
