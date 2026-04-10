import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * A reusable data table component for displaying tabular data
 * @example
 * <app-data-table [columns]="cols" [data]="rows"></app-data-table>
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  /** Column definitions for the table */
  @Input() columns: Array<{ field: string; header: string; sortable?: boolean }> = [];

  /** Array of data objects to display */
  @Input() data: any[] = [];

  /** Enable row selection */
  @Input() selectable: boolean = false;

  /** Number of rows per page */
  @Input() pageSize: number = 10;

  /** Emits when a row is selected */
  @Output() rowSelect = new EventEmitter<any>();

  /** Emits when sorting changes */
  @Output() sortChange = new EventEmitter<{ field: string; order: 'asc' | 'desc' }>();

  currentPage: number = 1;
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onRowClick(row: any) {
    if (this.selectable) {
      this.rowSelect.emit(row);
    }
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.sortChange.emit({ field, order: this.sortOrder });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }
}
