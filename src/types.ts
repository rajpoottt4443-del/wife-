export interface SiteConfig {
  herName: string;
  senderName: string;
  favoriteTreat: string;
  songTitle: string;
  songUrl: string;
  heroPhoto: string;
  photos: {
    id: number;
    url: string;
    caption: string;
    rotation: string;
  }[];
  cards: {
    id: string;
    title: string;
    icon: string;
    subtitle: string;
    fullMessage: string;
    quote: string;
  }[];
}
