export interface UserPic {
  filepath: string;
  webviewPath?: string;
}

export interface IPic {
  alt: string,
  id: number,
  src: { portrait: string }
  filepath: string;
  webviewPath?: string;
}

export interface IHttpResponse {
  next_page: string,
  page: number
  per_page: number,
  photos: IPic,
  total_results: number
}
