
function applyConvolution( sourceImageData, kernel) {

  const src = sourceImageData.data;
  
  const srcWidth = sourceImageData.width;
  const srcHeight = sourceImageData.height;
  
  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side/2);
  
  // padding the output by the convolution kernel
  const w = srcWidth;
  const h = srcHeight;
  
  // iterating through the output image pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {      
      let r = 0, g = 0, b = 0, a = 0;
      
      // calculating the weighed sum of the source image pixels that
      // fall under the convolution kernel
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          
          if (scy >= 0 && scy < srcHeight && scx >= 0 && scx < srcWidth) {
            let srcOffset = (scy*srcWidth+scx) * 4;
            let wt = kernel[cy*side+cx];
            r += src[srcOffset] * wt;
            g += src[srcOffset+1] * wt;
            b += src[srcOffset+2] * wt;
            a += src[srcOffset+3] * wt;
          }
        }
      }
      
      const dstOffset = (y*w+x)*4;
      
      src[dstOffset] = r;
      src[dstOffset+1] = g;
      src[dstOffset+2] = b;
      src[dstOffset+3] = a;
    }
  }
  
  return sourceImageData;
};
