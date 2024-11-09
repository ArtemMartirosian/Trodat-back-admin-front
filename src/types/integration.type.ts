export type SuccessIntegrationAnswer = {
  result: {
    quantity: number;
    goods: IntegrationProduct[];
    goodsGroups: IntegrationGroup[];
  };
  general: {
    response: number;
    error: false;
    message: string;
  }
};

export type ErrorIntegrationAnswer = {
  general: {
    response: number;
    error: true;
    message: string;
  };
};

export type IntegrationProduct = {
  name: string;
  article: string;
  sku: string;
  goodID: string;
  type: 0 | 1;
  vat: string;
  st: string;
  barcode: string;
  markType: number;
  measureCode: string;
  measureName: string;
  ownerID: string;
  description: string;
  originCountry: string;
  imageBase64: string;
  imagesBase64: [];
};

export type IntegrationGroup = {
  name: string;
  ID: string;
  ownerID: string;
}