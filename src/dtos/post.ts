export interface IPost {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly tags: Array<string>;
}
