export const getDistinctItem = (array: any[], field: string) => [
  ...new Set(array.map((item: any) => item[field])),
];
