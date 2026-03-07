export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type CountdownType = {
  ref: UUID;
  name: string;
  startDate: Date;
  endDate: Date;
};
