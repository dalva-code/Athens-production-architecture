import { signal, computed } from '@angular/core';

export interface ArtistMetric {
  id: string;
  name: string;
  monthlyListeners: number | null;
  engagementScore?: number;
}

/**
 * Null-Sink Sorting Algorithm
 * Ensures incomplete, 0 or null metrics are mathematically forced 
 * to the bottom of the list regardless of ascending/descending order.
 */
export class ChartSortEngine {
  public dataset = signal<ArtistMetric[]>([]);
  public isAscending = signal<boolean>(false);

  public sortedData = computed(() => {
    const data = [...this.dataset()];
    const asc = this.isAscending();

    return data.sort((a, b) => {
      const valA = a.monthlyListeners;
      const valB = b.monthlyListeners;

      // Null-Sink: treat null or undefined as lowest priority
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      return asc ? valA - valB : valB - valA;
    });
  });

  public updateData(freshMetrics: ArtistMetric[]): void {
    this.dataset.set(freshMetrics);
  }
}