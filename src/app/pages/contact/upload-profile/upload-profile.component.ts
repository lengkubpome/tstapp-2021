import { NbDialogRef } from "@nebular/theme";
import { Component, Input, OnInit } from "@angular/core";
import {
	base64ToFile,
	Dimensions,
	ImageCroppedEvent,
	ImageTransform,
} from "ngx-image-cropper";

@Component({
	selector: "app-upload-profile",
	templateUrl: "./upload-profile.component.html",
	styleUrls: ["./upload-profile.component.scss"],
})
export class UploadProfileComponent implements OnInit {
	@Input() file: File;
	public imageUrl: string | ArrayBuffer = "";

	imageChangedEvent: any = "";
	croppedImage: any = "";
	canvasRotation = 0;
	rotation = 0;
	scale = 1;
	showCropper = false;
	containWithinAspectRatio = false;
	transform: ImageTransform = {};
	imageFailed = false;

	constructor(protected ref: NbDialogRef<UploadProfileComponent>) {}

	ngOnInit(): void {}

	onClose(): void {
		this.ref.close(false);
	}

	onSave(): void {
		this.ref.close(this.croppedImage);
	}

	imageCropped(event: ImageCroppedEvent): void {
		this.croppedImage = event.base64;
		// console.log(event, base64ToFile(event.base64));
	}

	imageLoaded(): void {
		this.showCropper = true;
		console.log("Image loaded");
	}

	cropperReady(sourceImageDimensions: Dimensions): void {
		console.log("Cropper ready", sourceImageDimensions);
	}

	loadImageFailed(): void {
		console.log("Load failed");
		this.imageFailed = true;
	}

	rotateLeft(): void {
		this.canvasRotation--;
		this.flipAfterRotate();
	}

	rotateRight(): void {
		this.canvasRotation++;
		this.flipAfterRotate();
	}

	private flipAfterRotate(): void {
		const flippedH = this.transform.flipH;
		const flippedV = this.transform.flipV;
		this.transform = {
			...this.transform,
			flipH: flippedV,
			flipV: flippedH,
		};
	}

	flipHorizontal(): void {
		this.transform = {
			...this.transform,
			flipH: !this.transform.flipH,
		};
	}

	flipVertical(): void {
		this.transform = {
			...this.transform,
			flipV: !this.transform.flipV,
		};
	}

	resetImage(): void {
		this.scale = 1;
		this.rotation = 0;
		this.canvasRotation = 0;
		this.transform = {};
	}

	zoomOut(): void {
		this.scale -= 0.1;
		this.transform = {
			...this.transform,
			scale: this.scale,
		};
	}

	zoomIn(): void {
		this.scale += 0.1;
		this.transform = {
			...this.transform,
			scale: this.scale,
		};
	}

	toggleContainWithinAspectRatio(): void {
		this.containWithinAspectRatio = !this.containWithinAspectRatio;
	}

	updateRotation(): void {
		this.transform = {
			...this.transform,
			rotate: this.rotation,
		};
	}
}
