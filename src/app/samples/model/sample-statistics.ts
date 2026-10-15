export interface SampleStatistics {
  overview: Overview;
  statusDistribution: StatusDistribution[];
  categoryDistribution: CategoryDistribution[];
  favoriteDistribution: FavoriteDistribution;
  stockDistribution: StockDistribution;
  trashDistribution: TrashDistribution;
  monthlyCreations: MonthlyCreation[];
  priceStatistics: NumericStatistics;
  quantityStatistics: NumericStatistics;
}

export interface Overview {
  totalSamples: number;
  activeSamples: number;
  inactiveSamples: number;
  favoriteSamples: number;
  trashedSamples: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

export interface FavoriteDistribution {
  favorites: number;
  nonFavorites: number;
}

export interface StockDistribution {
  withStock: number;
  withoutStock: number;
}

export interface TrashDistribution {
  trashed: number;
  active: number;
}

export interface MonthlyCreation {
  month: string;
  count: number;
}

export interface NumericStatistics {
  min: number;
  max: number;
  average: number;
}
