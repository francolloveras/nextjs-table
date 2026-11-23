export type Valueof<Constant> = Constant[keyof Constant]

export type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>
