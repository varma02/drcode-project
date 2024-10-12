export default class Bitfield {

  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  has(bit: number): boolean {
    return (this.value & bit) === bit;
  }
  add(...bits: number[]): void {
    for (const bit of bits) {
      this.value |= bit;
    }
  }

  remove(...bits: number[]): void {
    for (const bit of bits) {
      this.value &= ~bit;
    }
  }

  valueOf(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
  
}