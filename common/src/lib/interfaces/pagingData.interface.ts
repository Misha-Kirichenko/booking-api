export interface IPagingData<T> {
  readonly total: number;
  readonly data: T[];
}
