import type { Photo } from '$lib/types/gallery';

const MEDIA_COLUMNS: Record<number, number> = {
	768: 2,
	1024: 3,
	1280: 4,
	1512: 5
};

class Gallery {
	#gutter = 14;
	#padding = 16;
	photos = $state<Photo[]>([]);
	activePhoto = $state(-1);

	async getPhotos() {
		const response = await fetch(
			`https://pixabay.com/api/?key=${import.meta.env.VITE_API_PIXABAY}&per_page=30&q=cityscape`
		);
		const data = await response.json();

		return data;
	}

	calculatePhotosSizes(photos: any) {
		let columns = MEDIA_COLUMNS[1512];
		const screenSizes = Object.keys(MEDIA_COLUMNS);
		const processedPhotos: Photo[] = [];

		for (const screenSize of screenSizes) {
			const s = Number(screenSize);
			if (window.innerWidth <= s) {
				columns = MEDIA_COLUMNS[s];
        break;
			}
		}

		const picWidth =
			(window.innerWidth - this.#padding * 2 - this.#gutter * (columns - 1)) / columns;
		for (const photo of photos) {
			const aspectRatio = photo.imageWidth / photo.imageHeight;
			let picHeight = picWidth / aspectRatio;

			const p: Photo = {
				url: photo.largeImageURL,
				width: Math.floor(picWidth),
				height: Math.floor(picHeight),
				x: 0,
				y: 0
			};
			processedPhotos.push(p);
		}

		this.#calculatePhotosPositions(processedPhotos, columns, picWidth);
	}

	#calculatePhotosPositions(processedPhotos: Photo[], columns: number, column_size: number) {
		this.photos = processedPhotos.map((photo, idx) => {
			const column = idx % columns;
			photo.x = column_size * column + this.#gutter * column;

			if (idx >= columns) {
				const row = Math.floor(idx / columns);
				const prev_photo_height = processedPhotos[idx - columns].height;
				const prev_photo_y =
					processedPhotos[idx - columns].y === 0 ? 0 : processedPhotos[idx - columns].y - 14 * (row - 1);

        photo.y = Math.floor(prev_photo_y + prev_photo_height + this.#gutter * row)
			}
      
      return photo;
		});
	}
}

export const gallery = new Gallery();