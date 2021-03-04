import { BinaryFieldMetadata, PropertyBuilderFunction, PropertyBuilderInit, PropertyReaderFunction, PropertyReaderInit } from "../types/Common.types";
import { Int16Options } from "../types/Int16.types";
import { ApplyPrototypeMetadata } from "./Common";

const Int16PropertyBuilder
: PropertyBuilderInit<Int16Options, number> = 
(options: Int16Options) : PropertyBuilderFunction<number> => {

    let writeMethod = 
        options.order == 'BigEndian' && options.unsigned
            ? (buffer: Buffer) => buffer.writeUInt16BE
            :
        options.order == 'BigEndian' && !options.unsigned
            ? (buffer: Buffer) => buffer.writeInt16BE 
            :
        options.order == 'LittleEndian' && options.unsigned
            ? (buffer: Buffer) => buffer.writeUInt16LE 
            : 
        options.order == 'LittleEndian' && !options.unsigned
            ? (buffer : Buffer) => buffer.writeInt16LE
            :
                (buffer: Buffer) => {
                    throw new Error(
                        'No write method available for '+JSON.stringify(options)
                    ) 
                }

    return (value: number, bitOffset?: number) => {

        let buffer = Buffer.alloc(2);

        writeMethod(buffer).bind(buffer)(value, 0);

        //TODO: resolve bit offset

        return [buffer, bitOffset || 0];

    }

}

const Int16PropertyReader
: PropertyReaderInit<Int16Options, number> =
(options: Int16Options) : PropertyReaderFunction<number> => {

    let readMethod = 
        options.order == 'BigEndian' && options.unsigned
            ? (buffer: Buffer) => buffer.readUInt16BE
            :
        options.order == 'BigEndian' && !options.unsigned
            ? (buffer: Buffer) => buffer.readInt16BE 
            :
        options.order == 'LittleEndian' && options.unsigned
            ? (buffer: Buffer) => buffer.readUInt16LE 
            : 
        options.order == 'LittleEndian' && !options.unsigned
            ? (buffer : Buffer) => buffer.readInt16LE
            :
                (buffer: Buffer) => {
                    throw new Error(
                        'No read method available for '+JSON.stringify(options)
                    ) 
                }

    return (buffer: Buffer, offset: number, bitOffset?: number) => {

        let value = readMethod(buffer).bind(buffer)(offset);

        //TODO: resolve bit offset
        
        return [value, bitOffset || 0, 2];

    }

}

const defaultOptions : Int16Options = {
    order: 'LittleEndian',
    unsigned: false
}

export const Int16 = (options : Int16Options = defaultOptions) : PropertyDecorator => 
(
    target: any, 
    propertyKey: string | symbol
) => {

    options = {...defaultOptions, ...options};

    let metadata : BinaryFieldMetadata<number> = {

        builder: Int16PropertyBuilder(options),
        reader: Int16PropertyReader(options),
        propertyKey: propertyKey.toString()

    }
    
    ApplyPrototypeMetadata(target, metadata);

}