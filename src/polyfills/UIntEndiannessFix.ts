Buffer.prototype.writeBigUint64LE = function (value: bigint, offset?: number) {
    return (this as Buffer).writeBigInt64LE(BigInt.asIntN(64, value), offset)
};

Buffer.prototype.writeBigUint64BE = function (value: bigint, offset?: number) {
    return (this as Buffer).writeBigInt64BE(BigInt.asIntN(64, value), offset)
};

Buffer.prototype.readBigUint64LE  = function (offset?: number) {
    const result = (this as Buffer).readBigInt64LE(offset)
    return BigInt.asUintN(64, result)
};

Buffer.prototype.readBigUint64BE  = function (offset?: number) {
    const result = (this as Buffer).readBigInt64BE(offset)
    return BigInt.asUintN(64, result)
};
