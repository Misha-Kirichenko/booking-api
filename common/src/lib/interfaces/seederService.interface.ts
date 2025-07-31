export interface ISeederService {
  getGeneratedRows: <T>(quantity: number) => Promise<T>;
  seed: (count: number) => Promise<void>;
}
