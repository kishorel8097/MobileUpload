import { AfterViewInit, Component } from "@angular/core";

@Component({
  selector: "canvas-image-data",
  templateUrl: "./canvas-image-data.component.html",
})
export class CanvasImageDataComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const url = "assets/images/chrome-logo.png";
    const image = new Image();
    image.src = url;

    image.addEventListener("load", () => {
      const canvas = document.getElementById("image-data") as HTMLCanvasElement;
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.drawImage(image, 0, 0);

      const scannedImage = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ) as ImageData;
      const imageData = scannedImage.data as Uint8ClampedArray;

      const pixelRgbas: RGBA[] = [];
      for (let index = 0; index < imageData.length; index += 4)
        pixelRgbas.push({
          r: imageData[index],
          g: imageData[index + 1],
          b: imageData[index + 2],
          a: imageData[index + 3],
        });

      const START = 0;
      const END = imageData.length;

      const uniqueRgbas: RGBA[] = [];
      pixelRgbas.slice(START, END).forEach((pixelRgba) => {
        const exists =
          uniqueRgbas.findIndex(
            (uniqueRgba) =>
              pixelRgba.r === uniqueRgba.r &&
              pixelRgba.g === uniqueRgba.g &&
              pixelRgba.b === uniqueRgba.b &&
              pixelRgba.a === uniqueRgba.a
          ) >= 0;

        if (!exists) uniqueRgbas.push(pixelRgba);
      });

      const pixelRgbaMap: number[] = [];
      pixelRgbas.slice(START, END).forEach((pixelRgba) => {
        pixelRgbaMap.push(
          uniqueRgbas.findIndex(
            (uniqueRgba) =>
              pixelRgba.r === uniqueRgba.r &&
              pixelRgba.g === uniqueRgba.g &&
              pixelRgba.b === uniqueRgba.b &&
              pixelRgba.a === uniqueRgba.a
          )
        );
      });

      const newImageData: Uint8ClampedArray = imageData.slice();
      for (
        let index = pixelRgbaMap.length - 1, i1 = 0;
        index >= 0;
        index--, i1 += 4
      ) {
        const rgbaMapIndex = pixelRgbaMap[index];
        const temp = uniqueRgbas[rgbaMapIndex];
        newImageData[i1 + 0] = temp.r;
        newImageData[i1 + 1] = temp.g;
        newImageData[i1 + 2] = temp.b;
        newImageData[i1 + 3] = temp.a;
      }

      const canvas1 = document.createElement("canvas");
      canvas1.width = 512;
      canvas1.height = 512;
      const ctx1 = canvas1.getContext("2d") as CanvasRenderingContext2D;

      ctx1.putImageData(
        new ImageData(newImageData, 512, 512, { colorSpace: "srgb" }),
        0,
        0
      );

      (document.getElementById("div") as HTMLDivElement).appendChild(canvas1);

      // console.log("imageData", imageData);
      // console.log("pixelRgbas", pixelRgbas.slice(START, END));
      // console.log("uniqueRgbas", uniqueRgbas);
      // console.log("pixelRgbaMap", pixelRgbaMap);
      // console.log("newImageData", newImageData);
    });
  }
}

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};
