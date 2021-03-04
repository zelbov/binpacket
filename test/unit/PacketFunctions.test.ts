import 'mocha';
import { expect } from 'chai';
import { Int16 } from '../../src/decorators/Int16';
import { BinaryObjectMetadata } from '../../src/types/Common.types';

import { buildPacket } from '../../src/functions/Build';
import { serializePacket } from '../../src/functions/Serialize';

describe('Decorated packet object building tests', () => {

    it('Metadata verfication', () => {

        try {

            buildPacket(1);

        } catch(ex){

            expect(ex.message).match(/does not have binary structure metadata/);

        }

    })

    it('Check whether binary metadata assigned properly to object prototype', () => {

        class TestStruct 
        {

            @Int16()
            testInt: number = 1;

            @Int16()
            testInt2: number = 2;

        }

        let proto : any = TestStruct.prototype,
            { __binmeta } : BinaryObjectMetadata = proto;

        expect(__binmeta).not.undefined;

        expect(__binmeta[0].propertyKey).eq('testInt');
        expect(__binmeta[1].propertyKey).eq('testInt2');

    })

    it('Check whether binary metadata assigned properly to instantiated object', () => {

        class TestStruct 
        {

            @Int16()
            testInt: number = 1;

            @Int16()
            testInt2: number = 2;

        }

        let struct : any = new TestStruct(),
            proto: BinaryObjectMetadata = struct,
            { __binmeta } = proto;

        expect(__binmeta).not.undefined;

        expect(__binmeta[0].propertyKey).eq('testInt');
        expect(__binmeta[1].propertyKey).eq('testInt2');

    })

    it('Building packet from object without decorators usage', () => {

        class TestStruct {

            testInt: number = 1;
            testInt2: number = 2;

        }

        // both ways are appropriate
        Int16()(TestStruct, 'testInt');
        Int16()(TestStruct.prototype, 'testInt2');

        let obj = new TestStruct(),
            packet = buildPacket(obj);

        // packet: <Buffer 00 01 00 02>

        expect(packet[0]).eq(0x01);
        expect(packet[1]).eq(0x00);
        expect(packet[2]).eq(0x02);
        expect(packet[3]).eq(0x00);

    })

    it('Building packet from instantiated object', () => {

        class TestStruct 
        {

            @Int16()
            testInt: number = 1;

            @Int16()
            testInt2: number = 2;

        }

        let obj = new TestStruct(),
            packet = buildPacket(obj);

        // packet: <Buffer 00 01 00 02>

        expect(packet[0]).eq(0x01);
        expect(packet[1]).eq(0x00);
        expect(packet[2]).eq(0x02);
        expect(packet[3]).eq(0x00);



    })

    it('Serializing packet as predefined structure', () => {

        class TestStruct 
        {

            @Int16()
            testInt: number = 1;

            @Int16({unsigned: true})
            testInt2: number = 2;

        }

        let packet = Buffer.from([0x00, 0x80, 0x00, 0x80]),
            serialized = serializePacket(packet, new TestStruct());

        expect(serialized.testInt).eq(-32768); //since signed
        expect(serialized.testInt2).eq(32768); //since unsigned

    })

})