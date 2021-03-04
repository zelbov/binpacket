

export const verifyMetadata = 
!process.env.BINPACKET_NO_VERIFY_METADATA
? (struct: any) => {

    if(!Object.getPrototypeOf(struct).__binmeta) 
        throw new Error(
            'Object '+struct.constructor.name+' does not have binary structure metadata'
        );
}
: (struct: any) => { /*NO-OP*/ };