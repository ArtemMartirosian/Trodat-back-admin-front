export class NewsCreateDto {
  title: string;
  type: 'news' | 'promotion';
  shortDescription: string;
  fullDescription: string;
  image: string;
}

export class NewsUpdateDto {
  title: string;
  type: 'news' | 'promotion';
  shortDescription: string;
  fullDescription: string;
  image: string;
}
