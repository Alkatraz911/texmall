export interface AboutPageData {
  id?: number;
  title: string;
  subtitle: string;
  historyTitle: string;
  historyText1: string;
  historyText2: string;
  historyImage: string;
  qualitySectionTitle: string;
  qualityItems: {
    title: string;
    text: string;
  }[];
  deliveryTitle: string;
  deliveryText: string;
  deliveryOptions: { title: string; text: string }[];
  deliveryNote: string;
  deliveryImage: string;
  ctaTitle: string;
  ctaSubtitle: string;

}

