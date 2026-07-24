export abstract class StorageService {
  abstract upload(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract getPublicUrl(key: string): string;
}
