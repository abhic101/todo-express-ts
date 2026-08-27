type T = {
    a: string,
    b: number
};

type O = Omit<T, 'a'>;
type P = Pick<T, 'b'>;

type Q = O & Pick<T, 'a'>;