import { tuyau } from '$lib/api';
import type { TDefault, TNote, TPDF, TPhoto, TVideo } from '$lib/types/space';
import {
  calculateCellPosition,
  calculateNoteSize,
  calculatePdfSize,
  calculatePhotoSize,
  calculateVideoSize
} from '$lib/utils/gallery';
import { Subscription } from '@adonisjs/transmit-client';
import { mainStore, GUTTER } from './mainStore.svelte';
import { space } from './space.svelte';
import { auth } from './auth.svelte';
import type { ApiCell } from '$lib/types/api';
import { cell } from './cell.svelte';
import { formatDate } from '$lib/utils/date';
import { sidebar } from './sidebar.svelte';
import { backdrop } from './backdrop.svelte';
import { uploadMedia } from '$lib/utils/media';
import { debounce, debounceAsync } from '$lib/utils/debounce';
import { search } from './search.svelte';

class Branch {
  cells = $state<ApiCell[] | undefined>();
  cellWrapper = $state<HTMLDivElement | null>();
  branchChannel = $state<Subscription | undefined>();
  stopListeningToBranch = $state();
  changingBranch = $state(false);
  latestNbOfAddedCells = $state(0);

  async getCells() {
    const { data, error } = await tuyau.v1.branch
      .cells({ branchId: '' + space.currentBranch?.id })
      .$get();

    if (error) {
      console.error(error);
    }

    branch.cells = data as ApiCell[];
  }

  addCells(cells: ApiCell[]) {
    if (!this.cells) return;
    if (!cells) return [];
    this.latestNbOfAddedCells = cells.length;
    this.cells.push(...cells);
  }

  rewind() {
    if (!this.cells) return;
    const rewindIdx = this.cells.length - this.latestNbOfAddedCells;
    this.cells.splice(rewindIdx);
  }

  updateCells(cells: ApiCell[]) {
    if (!this.cells) return;
    if (!cells) return [];

    for (const cell of cells) {
      const cellToUpdate = this.cells.findIndex((c) => c.id === cell.id);
      if (cellToUpdate !== -1) {
        this.cells[cellToUpdate] = {
          ...cell,
          tags: this.cells[cellToUpdate].tags,
          media: {
            ...cell.media,
            resizedUrl: this.cells[cellToUpdate].media.resizedUrl,
            blurUrl: this.cells[cellToUpdate].media.blurUrl
          }
        };
      }
    }
  }

  processCells(cells: ApiCell[] | undefined): Array<TPhoto | TNote | TVideo | TPDF | TDefault> {
    mainStore.columnHeights.fill(0);
    const processedCells = [];

    const mainCell: TDefault = {
      id: -1,
      type: 'default',
      width: Math.floor(mainStore.colWidth),
      height: Math.floor(mainStore.colWidth),
      x: 0,
      y: 0
    };
    processedCells.push(mainCell);
    mainStore.columnHeights[0] += mainCell.height + GUTTER;

    if (!cells) return processedCells;

    for (const cell of cells) {
      if (cell.type.startsWith('image')) {
        const photo_size = calculatePhotoSize(cell);
        const photo_pos = calculateCellPosition(photo_size);
        processedCells.push(photo_pos);
      } else if (cell.type.startsWith('video')) {
        const video_size = calculateVideoSize(cell);
        const video_pos = calculateCellPosition(video_size);
        processedCells.push(video_pos);
      } else if (cell.type.startsWith('note')) {
        const note_size = calculateNoteSize(cell);
        const note_pos = calculateCellPosition(note_size);
        processedCells.push(note_pos);
      } else if (cell.type === 'application/pdf') {
        const pdf_size = calculatePdfSize(cell);
        const pdf_pos = calculateCellPosition(pdf_size);
        processedCells.push(pdf_pos);
      }
    }

    if (branch.cellWrapper) {
      branch.cellWrapper.style.height = Math.max(...mainStore.columnHeights) + 18 + 'px';
    }

    return processedCells;
  }

  async create(branchName: string) {
    const existingBranch = space.currentSpace!.branches.find(
      (branch) => branch.name.toLowerCase() === branchName.toLowerCase()
    );

    if (existingBranch) {
      this.cells = undefined;
      await space.goto(space.currentSpace!, existingBranch);
      this.changingBranch = false;
      return;
    }

    const { data, error } = await tuyau.v1.branch.create.$post({
      branchName: branchName,
      spaceId: space.currentSpace!.id
    });

    // TODO: Add toast error if creation impossible
    if (error) {
      console.error(error);
      return;
    }

    const spaceIdx = auth.user?.spaces.findIndex((s) => s.id === space.currentSpace!.id);
    auth.user?.spaces[spaceIdx!].branches.push(data);

    await space.goto(space.currentSpace!, data);
    this.changingBranch = false;
    this.cells = undefined;
  }

  async rename(branchName: string) {
    if (!space.currentSpace || !space.currentBranch) return;

    const existingBranch = space.currentSpace!.branches.find(
      (branch) => branch.name.toLowerCase() === branchName.toLowerCase()
    );
    if (existingBranch) {
      //TODO: toast error: can't use the name of an existing branch
      this.changingBranch = false;
      return;
    }

    const oldName = space.currentBranch!.name;
    const spaceIdx = auth.user!.spaces.findIndex((s) => s.id === space.currentSpace!.id);
    const branchIdx = auth.user!.spaces[spaceIdx].branches.findIndex(
      (b) => b.id === space.currentBranch!.id
    );

    if (spaceIdx > -1 && branchIdx > -1) {
      auth.user!.spaces[spaceIdx].branches[branchIdx].name = branchName;
    }

    const { error } = await tuyau.v1.branch.rename.$post({
      branchId: space.currentBranch!.id,
      name: branchName
    });

    if (error) {
      //TODO: Add toast error to explain why it got renamed back to original
      console.error(error);
      auth.user!.spaces[spaceIdx].branches[branchIdx].name = oldName;
    }

    await space.goto(auth.user!.spaces[spaceIdx], auth.user!.spaces[spaceIdx].branches[branchIdx]);
    this.changingBranch = false;
  }

  async delete() {
    if (!space.currentSpace || !space.currentBranch) return;

    if (space.currentBranch.id === auth.user!.spaces[0].branches[0].id) {
      //TODO: Add toast error to explain you can't delete your first ever created space
      return;
    }

    const { error } = await tuyau.v1.branch.delete.$post({ branchId: space.currentBranch.id });

    if (error) {
      //TODO: Add toast error to explain why the deletion wasn't successful
      console.error(error);
    }

    await space.goto(auth.user!.spaces[0], auth.user!.spaces[0].branches[0]);
    this.changingBranch = false;
    branch.cells = undefined;
  }

  async createNote(title?: string) {
    cell.active = {
      type: 'note',
      title: title || '',
      content: undefined,
      createdAt: formatDate(new Date().toString())
    } as TNote;
    cell.activeIdx = branch.cells!.length;
    sidebar.open();
    sidebar.focusEditor();

    const { data, error } = await tuyau.v1.cell.create_note.$post({
      title: title,
      branchId: space.currentBranch?.id
    });

    if (error) {
      console.error(error);
      if (branch.cells) {
        branch.cells.pop();
      }
      backdrop.close();
      sidebar.close();
      return;
    }

    if (branch.cells) {
      branch.cells.push(data);
    } else {
      branch.cells = [data];
    }
    cell.active = {
      ...data,
      createdAt: formatDate(data.createdAt)
    };
  }

  async uploadFile(title?: string) {
    const el = document.createElement('input');
    el.style.display = 'none';
    el.type = 'file';

    if (!title) {
      el.multiple = true;
    }

    document.body.appendChild(el);
    el.click();

    el.onchange = async (e) => {
      const target = e.target as HTMLInputElement;

      await uploadMedia(undefined, target.files, title);
    };

    document.body.removeChild(el);
  }


  async filterCells(query: string) {
    if (!branch.cells) return [];
    if (query === "") return branch.cells;

    let filteredCells: ApiCell[] = [];

    // global search
    if (search.activeCommand?.type === 'global' && query.length > 0) {
      filteredCells = await this.#debouncedGlobalSearch();
      return filteredCells
    }

    // local search
    filteredCells = branch.cells.filter(cell => this.#filterByTags(cell, query) || this.#filterByContent(cell, query) || this.#filterByTitle(cell, query));

    // remote search
    if (filteredCells.length === 0 && query.length > 0) {
      filteredCells = await this.#debouncedSearch();
    }

    return filteredCells
  }

  #debouncedGlobalSearch = debounceAsync(() => search.global(), 200);

  #debouncedSearch = debounceAsync(() => search.cells(), 200);

  #filterByTags(cell: ApiCell, query: string) {
    return cell.tags.toLowerCase().includes(query.toLowerCase().trim());
  }

  #filterByTitle(cell: ApiCell, query: string) {
    return cell.title.toLowerCase().includes(query.toLowerCase().trim());
  }

  #filterByContent(cell: ApiCell, query: string) {
    return cell.searchContent?.toLowerCase().includes(query.toLowerCase().trim());
  }
}

export const branch = new Branch();
