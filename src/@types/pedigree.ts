

type PedigreeProps = {
    id: string;
    name: string;
    colorCode?: string;
    tag?: string;
 }
let obj = {
    gen1: "",
    gen2: "", 
    gen3: ""
}

export type MappedType<T> = {
    [P in keyof T]?: T[P];
}

export type PedigreeObj = MappedType<typeof obj>

export type myPick<T, Props extends keyof T> = {
    [P in Props] : T[P]
}

export type myOmit<T, Props extends keyof T> = {}

export type myRecord<K extends keyof any, T> = {
    [P in K]: T
}

type subObj = myPick<{a:'a', b:'b',c:'c'}, 'a' | 'b'>

export type PedigreeRecord = myRecord<string, PedigreeProps[]>

