import 'mocha';
import { Int16 } from '../../src/decorators/Int16';
import { buildPacket } from '../../src/functions/Build';

class TestPacketTwoInt16 {

    @Int16()
    testField1: number = 99;

    @Int16({ order: 'LittleEndian', unsigned: true })
    testField2: number = 127;


}

describe('Packet builder benchmarking', () => {

    it('Build packet with two Int16 fields 1M times', function () {

        this.timeout(0);

        let obj = new TestPacketTwoInt16();

        for(let i = 0; i < 1_000_000; i++) {

            buildPacket(obj);

        }

    })


})