import { createHash } from 'crypto';
import { Consensus, _Event } from './consensus';
import _ from 'lodash';

describe('Consensus', () => {
    //
    let consensus: Consensus<never>;
    let events: _Event<never>[];

    const h = <T>(x: _Event<T>): string => {
        const hashable = JSON.stringify(x);
        return createHash('sha256').update(hashable).digest('hex');
    };

    const c = <T>(events: _Event<T>[], x: number, self: number, other: number): void => {
        events[x].selfParent = h(events[self]);
        events[x].otherParent = h(events[other]);
    };

    /**
     * We construct a `test`-hashgraph based on an image from a explanation
     * video so we can see if the implementation is valid.
     */
    beforeAll(() => {
        events = [];
        const now = Date.now();

        for (let i = 0; i < 35; i++) {
            // Create a predictable set of times for testing.
            const date = now + (i * 60000)

            events.push({ id: `${i}`, createdAt: date, publicKey: '' });
        }

        // Set the signature for each event.
        [0, 8, 13, 15, 18, 22, 28, 30].forEach((i) => events[i].publicKey = 'Alice');
        [1, 5, 7, 11, 14, 20, 21, 24, 27, 29, 31, 34].forEach((i) => events[i].publicKey = 'Bob');
        [2, 10, 17, 26].forEach((i) => events[i].publicKey = 'Carol');
        [3, 6, 9, 12, 16, 19, 23, 25, 32, 33].forEach((i) => events[i].publicKey = 'Dave');

        // Set the parents for each event.
        c(events, 4, 3, 1);
        c(events, 5, 1, 4);
        c(events, 6, 4, 5);
        c(events, 7, 5, 2);
        c(events, 8, 0, 5);
        c(events, 9, 6, 7);
        c(events, 10, 2, 7);
        c(events, 11, 7, 9);
        c(events, 12, 9, 8);
        c(events, 13, 8, 12);
        c(events, 14, 11, 12);
        c(events, 15, 13, 10);
        c(events, 16, 12, 14);
        c(events, 17, 10, 15);
        c(events, 18, 15, 14);
        c(events, 19, 16, 18);
        c(events, 20, 14, 18);
        c(events, 21, 20, 19);
        c(events, 22, 18, 21);
        c(events, 23, 19, 21);
        c(events, 24, 21, 22);
        c(events, 25, 23, 17);
        c(events, 26, 17, 25);
        c(events, 27, 24, 22);
        c(events, 28, 22, 27);
        c(events, 29, 27, 26);
        c(events, 30, 28, 29);
        c(events, 31, 29, 30);
        c(events, 32, 25, 29);
        c(events, 33, 32, 26);
        c(events, 34, 31, 33);
    });

    beforeEach(() => {
        consensus = new Consensus();
    });

    describe('do', () => {

        it('handles spaced amounts', () => {

            const events: _Event<never>[] = [
                {
                    id: 'bac8a020-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462644514,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                },
                {
                    id: 'babd2e70-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462644439,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                },
                {
                    id: 'ba562f40-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462643764,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                },
                {
                    id: 'baee77a0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462644762,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '6bc4c43c0d3631e4c121711aa32d1a24a6f60c3e65ce37a476c91a198592b2c3',
                    otherParent: '025210bd1f5a17ba8afcc73a3f4d38efc786d8c0f1949c1ccec4a90272e2e2ed'
                },
                {
                    id: 'bb09c7d0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462644942,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '26ab863a2bc3c637f3b796481f4e14460b10edef3da2e66e30f60f0259814152',
                    otherParent: '4ec0af8ff6a909b1bd62fa32dc5d807888d7e2f2fd60c0584120489b89afffb5'
                },
                {
                    id: 'bb151270-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462645015,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '025210bd1f5a17ba8afcc73a3f4d38efc786d8c0f1949c1ccec4a90272e2e2ed',
                    otherParent: '6e0472a9e4066ac86e3865618a1fc9a3ddfc96012fd376683f1ad8a98da38477'
                },
                {
                    id: 'bace6c80-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462644552,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                },
                {
                    id: 'bb1a1b80-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462645048,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'ed214f1c5b8a8118a075d5523a89dd3285a6c6dd79816aef8c6435fe9db435e8',
                    otherParent: 'ce3f79ecb408b1d658c4f36d23922ff39a2eb3f39a202efc950e35d1240cce42'
                },
                {
                    id: 'bb3ae9f0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462645263,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '4ec0af8ff6a909b1bd62fa32dc5d807888d7e2f2fd60c0584120489b89afffb5',
                    otherParent: 'c80f5ce7627521f264e5362a042b6889e6694ec5d3a7be6fc51f4edd73141bbb'
                },
                {
                    id: 'bb568840-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462645444,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'c80f5ce7627521f264e5362a042b6889e6694ec5d3a7be6fc51f4edd73141bbb',
                    otherParent: 'e6fddb4ebf256726e49aff9753e7032197db8e10cf3476836fdd47b4d6b9bfa7'
                },
                {
                    id: 'bb875c40-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462645764,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'e6fddb4ebf256726e49aff9753e7032197db8e10cf3476836fdd47b4d6b9bfa7',
                    otherParent: 'f1a4bf3c330a9a48d8a09d04c820722e45293c21d996283a227ebd0239fd3d33'
                },
                {
                    id: 'bba43310-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462645953,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'ce3f79ecb408b1d658c4f36d23922ff39a2eb3f39a202efc950e35d1240cce42',
                    otherParent: '8945d98eea585d2e0ae0a305cd40b39ecf80d9c515acd0d2ff3c198d3c6e083e'
                },
                {
                    id: 'bbb3c370-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462646055,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '8945d98eea585d2e0ae0a305cd40b39ecf80d9c515acd0d2ff3c198d3c6e083e',
                    otherParent: 'ec8ae85938bc06015a2c708aa46eb35e5c24e1f78a3d0bd7b643e45979460452'
                },
                {
                    id: 'bbefe210-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462646449,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'f1a4bf3c330a9a48d8a09d04c820722e45293c21d996283a227ebd0239fd3d33',
                    otherParent: 'e0c2c9ce737e85aa7caa3f1b99bf26d4566aa4d540eaab51c48af82c19230848'
                },
                {
                    id: 'bc21c780-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462646776,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '6e0472a9e4066ac86e3865618a1fc9a3ddfc96012fd376683f1ad8a98da38477',
                    otherParent: '1b00d54dea428c209ad912dd78f9df8606b7eac86908457770686ddeb6e1664f'
                },
                {
                    id: 'bc466680-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462647016,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'e0c2c9ce737e85aa7caa3f1b99bf26d4566aa4d540eaab51c48af82c19230848',
                    otherParent: '9b5fd023974afea4bee3b78167def3cf8029e995860bbca25a1303ee9e2f6615'
                },
                {
                    id: 'bc3bb820-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462646946,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'ec8ae85938bc06015a2c708aa46eb35e5c24e1f78a3d0bd7b643e45979460452',
                    otherParent: 'e0c2c9ce737e85aa7caa3f1b99bf26d4566aa4d540eaab51c48af82c19230848'
                },
                {
                    id: 'bc4d6b60-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462647062,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '1b00d54dea428c209ad912dd78f9df8606b7eac86908457770686ddeb6e1664f',
                    otherParent: 'ff9dafdfb3f060b61b2ca9c4423868e94c4cd38ce1ad67596c79a5ff854c042c'
                },
                {
                    id: 'bc6d2860-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462647270,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '57a3538a8cb73f4dfdced90d835dbe6271ab17ad85556eddfc1357f98c06d448',
                    otherParent: '233b23c3f20aeda915b8de7b36c8aff28987bede1d3d4cde4d7bdf7bd2e66b34'
                },
                {
                    id: 'bc89b110-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462647457,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'ff9dafdfb3f060b61b2ca9c4423868e94c4cd38ce1ad67596c79a5ff854c042c',
                    otherParent: '560e8b8de1ba4b5683364398b81c7970c4aecc713b642b51d780fc11b4a25475'
                },
                {
                    id: 'bc9aa100-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462647568,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '233b23c3f20aeda915b8de7b36c8aff28987bede1d3d4cde4d7bdf7bd2e66b34',
                    otherParent: '9e3864e5ab359e80e9f0040a4226e892a20acd821703b722c941e9d14ba33792'
                },
                {
                    id: 'bcba5e00-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462647776,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '9e3864e5ab359e80e9f0040a4226e892a20acd821703b722c941e9d14ba33792',
                    otherParent: 'ab11d505119e3c683ecf5c87d88d1c212c686798074784a2b838657d289eb175'
                },
                {
                    id: 'bce73a60-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462648070,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '560e8b8de1ba4b5683364398b81c7970c4aecc713b642b51d780fc11b4a25475',
                    otherParent: '35d8573a18029c12ce0a310e40704339872fe077b8853f5ad98d6e699904ed7b'
                },
                {
                    id: 'bd235900-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462648464,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '9b5fd023974afea4bee3b78167def3cf8029e995860bbca25a1303ee9e2f6615',
                    otherParent: '30a33a60a81697040a6b0a8c1aa454820afdb5057aefe7521228bcb6926fd860'
                },
                {
                    id: 'bd2c59b0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462648523,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '30a33a60a81697040a6b0a8c1aa454820afdb5057aefe7521228bcb6926fd860',
                    otherParent: 'cfc3485662193289d1951315c8891829c49d5efb4582642753af73302c65ed80'
                },
                {
                    id: 'bdbab700-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462649456,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'cfc3485662193289d1951315c8891829c49d5efb4582642753af73302c65ed80',
                    otherParent: 'f0e858f09622d0d8b70af0b3b1f6e155b89e026172f9d7579990e06944299b1c'
                },
                {
                    id: 'bd6fcb50-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462648965,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'ab11d505119e3c683ecf5c87d88d1c212c686798074784a2b838657d289eb175',
                    otherParent: 'f0e858f09622d0d8b70af0b3b1f6e155b89e026172f9d7579990e06944299b1c'
                },
                {
                    id: 'bdc53e50-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462649526,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '7d92689fabf8b6764d0c074da182ce5d17d54c36ec10deee0ac63a3c4586d735',
                    otherParent: '09d876bcdd0d62c447599241047d1886dcd8a67771af1388c32ea767140aefb2'
                },
                {
                    id: 'be389990-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462650281,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '09d876bcdd0d62c447599241047d1886dcd8a67771af1388c32ea767140aefb2',
                    otherParent: '6595a3ecb798c59ad0eeabbc0dd1c47bb15dfde213a2de8038cc25bd8f7792c3'
                },
                {
                    id: 'bda02a20-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462649282,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '35d8573a18029c12ce0a310e40704339872fe077b8853f5ad98d6e699904ed7b',
                    otherParent: '7d92689fabf8b6764d0c074da182ce5d17d54c36ec10deee0ac63a3c4586d735'
                },
                {
                    id: 'bdcc4330-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462649571,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'f0e858f09622d0d8b70af0b3b1f6e155b89e026172f9d7579990e06944299b1c',
                    otherParent: '305a833b8f44cc61d132c1f5dd5ef62bda188b5cb1e182c3ffe08587d8e455ac'
                },
                {
                    id: 'bdeb63f0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462649775,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'dcf0812b9e5751be283873d7c44f107cefe96229a7bbe06dd21cdce2c1343cc7',
                    otherParent: '6595a3ecb798c59ad0eeabbc0dd1c47bb15dfde213a2de8038cc25bd8f7792c3'
                },
                {
                    id: 'be08fe10-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462649969,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '305a833b8f44cc61d132c1f5dd5ef62bda188b5cb1e182c3ffe08587d8e455ac',
                    otherParent: 'a0bd4a588d0deea6f9bb1ebb4c0385b1d1c882d84c1fcd1d57bc31da4c1bbfde'
                },
                {
                    id: 'be181940-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462650068,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'a0bd4a588d0deea6f9bb1ebb4c0385b1d1c882d84c1fcd1d57bc31da4c1bbfde',
                    otherParent: '166ad3366228303a15f7339b3d382709a9038c8c2993813c46f404fc2e560dc3'
                },
                {
                    id: 'be53e9c0-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462650460,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '166ad3366228303a15f7339b3d382709a9038c8c2993813c46f404fc2e560dc3',
                    otherParent: '0f9f3b27033a2be65f73bf2305615e54c72da7495e5117d7403597cb3ab677e7'
                },
                {
                    id: 'be5ebf30-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462650532,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '854ce7867710b4f207da9cc639dcc4e25b30882cd0874f7c192cba6a21f6f2b7',
                    otherParent: 'a0c3511ac857e41b1faff81380243255eeddcd9b47282e19bea5091d1532f3e0'
                },
                {
                    id: 'be6575f0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462650575,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '0f9f3b27033a2be65f73bf2305615e54c72da7495e5117d7403597cb3ab677e7',
                    otherParent: '6a19af5f3b10a7ee16a0baf4d46ad3eb22a47275d9aa8b49fe678ccb9739453b'
                },
                {
                    id: 'bea34240-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462650980,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'a0c3511ac857e41b1faff81380243255eeddcd9b47282e19bea5091d1532f3e0',
                    otherParent: '792994abc064bd64e3f75d5a6c09f5cfe7d1d536d7ab966dc01d4390aa8e88e7'
                },
                {
                    id: 'beb03a90-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462651065,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '6595a3ecb798c59ad0eeabbc0dd1c47bb15dfde213a2de8038cc25bd8f7792c3',
                    otherParent: 'c48a4f28e50a48afbd97840c6a84a041f06e75eb361067f6f9d168ac5fbe1c6d'
                },
                {
                    id: 'bed0bae0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462651278,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'c48a4f28e50a48afbd97840c6a84a041f06e75eb361067f6f9d168ac5fbe1c6d',
                    otherParent: 'd4a846cd64727a85fff255aa7fe494c8a09ae4b1f44db37e1f43e1e3a9e7a217'
                },
                {
                    id: 'befad820-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462651554,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '6a19af5f3b10a7ee16a0baf4d46ad3eb22a47275d9aa8b49fe678ccb9739453b',
                    otherParent: 'd7db9f58770747434ed5b39f05807c3efda62234423ab23b5744d75c4923a943'
                },
                {
                    id: 'befecfc0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462651580,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '792994abc064bd64e3f75d5a6c09f5cfe7d1d536d7ab966dc01d4390aa8e88e7',
                    otherParent: '0229b8bf25ee974ed712f17f62473d5f26dfb6653f9c8a39bc47c56b07501e58'
                },
                {
                    id: 'bf3940b0-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462651963,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '0229b8bf25ee974ed712f17f62473d5f26dfb6653f9c8a39bc47c56b07501e58',
                    otherParent: '910982d3fab766c926d1a003a90eaaf8ba11958fcfca169f830066a18fe7464f'
                },
                {
                    id: 'bf4a30a0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462652074,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'd7db9f58770747434ed5b39f05807c3efda62234423ab23b5744d75c4923a943',
                    otherParent: 'fb5c7d74a188f7063f3216226935363ad803b4c3495347295d7c2070ad475e6c'
                },
                {
                    id: 'bf871290-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462652473,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'd4a846cd64727a85fff255aa7fe494c8a09ae4b1f44db37e1f43e1e3a9e7a217',
                    otherParent: '910982d3fab766c926d1a003a90eaaf8ba11958fcfca169f830066a18fe7464f'
                },
                {
                    id: 'bf92ab50-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462652549,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'ff2a6f3de6176a3761519ff62950033a78cb9a34e768a3082d6e47ab4909e788',
                    otherParent: 'f8b0589669ed55394a6338ec58bfd0ba28c4268016a4c1d837b96255fc8fc124'
                },
                {
                    id: 'bfb72340-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462652788,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'fb5c7d74a188f7063f3216226935363ad803b4c3495347295d7c2070ad475e6c',
                    otherParent: 'bd61cf6bc8c3c5d3d10245fa209bf43f13685d08bf355eae860021842d1d7bc6'
                },
                {
                    id: 'bf962dc0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462652572,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '910982d3fab766c926d1a003a90eaaf8ba11958fcfca169f830066a18fe7464f',
                    otherParent: 'fb5c7d74a188f7063f3216226935363ad803b4c3495347295d7c2070ad475e6c'
                },
                {
                    id: 'bfd27370-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462652967,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'd59c4bcbdfd99fb8f1307cf0d70aa30bec75274c1e9cac126080ffed4ec624fc',
                    otherParent: '56bb8fb1b02f78f03a05c689b8bcafaea3ebd3f11e0fa24d17f42df516b3b2dc'
                },
                {
                    id: 'bfe426b0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462653083,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'f8b0589669ed55394a6338ec58bfd0ba28c4268016a4c1d837b96255fc8fc124',
                    otherParent: 'b2431f8eba8be3a6db573b13881b9bbfa9fe7e0f95d658d5bc601a2a69b25b74'
                },
                {
                    id: 'c02c5340-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462653556,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '56bb8fb1b02f78f03a05c689b8bcafaea3ebd3f11e0fa24d17f42df516b3b2dc',
                    otherParent: 'e31a84b4b467b051dc5a8e83319e33dc473ecde803f8f6e0a87d8db6e81b4003'
                },
                {
                    id: 'c06b5810-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462653969,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'e31a84b4b467b051dc5a8e83319e33dc473ecde803f8f6e0a87d8db6e81b4003',
                    otherParent: '8f1c6f7b50ac4dbb62031cf176ba0647a79a24d7de620eb245274fc58d4a2268'
                },
                {
                    id: 'c0776600-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462654048,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '8f1c6f7b50ac4dbb62031cf176ba0647a79a24d7de620eb245274fc58d4a2268',
                    otherParent: 'daab0b8b9a228f352d8cb513b55e9441e552d79d5c9b3fc34ad913382775679e'
                },
                {
                    id: 'c07c9620-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462654082,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'bd61cf6bc8c3c5d3d10245fa209bf43f13685d08bf355eae860021842d1d7bc6',
                    otherParent: 'b2431f8eba8be3a6db573b13881b9bbfa9fe7e0f95d658d5bc601a2a69b25b74'
                },
                {
                    id: 'c09c2c10-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462654289,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '4c67299dd9c8de70ffdcd5f6312a1417aca61de11e934737d4146903a3d0023b',
                    otherParent: '5370ce31530673201bd833d83c4ebd94388a451b31bcd5821267961c37188eff'
                },
                {
                    id: 'c0b97810-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462654481,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'b2431f8eba8be3a6db573b13881b9bbfa9fe7e0f95d658d5bc601a2a69b25b74',
                    otherParent: '18febf7e3c6ea636511d319a6050398a6f1e15f0856ea62839b3f254c99723a4'
                },
                {
                    id: 'c0ca6800-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462654592,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '5370ce31530673201bd833d83c4ebd94388a451b31bcd5821267961c37188eff',
                    otherParent: 'f12f7fa12e7b30689be72a9e056e57616f2051dfe1604e52152e0c8d1e4959bd'
                },
                {
                    id: 'c0e91390-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462654793,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '18febf7e3c6ea636511d319a6050398a6f1e15f0856ea62839b3f254c99723a4',
                    otherParent: '8b2bd81e9ab1f058e3a0ba36a2a2a0076d33b7f3e6f6cb5a299626d263d41511'
                },
                {
                    id: 'c10686a0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462654986,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'daab0b8b9a228f352d8cb513b55e9441e552d79d5c9b3fc34ad913382775679e',
                    otherParent: 'c297f8da5ed7a38cba60f4c86091c769d3aa08a98262a798534f0e47ef451524'
                },
                {
                    id: 'c135acf0-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462655295,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'f12f7fa12e7b30689be72a9e056e57616f2051dfe1604e52152e0c8d1e4959bd',
                    otherParent: '8b2bd81e9ab1f058e3a0ba36a2a2a0076d33b7f3e6f6cb5a299626d263d41511'
                },
                {
                    id: 'c1619ef0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462655583,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'dd73ab2e5bfc377673d633066c80ffbaad6c5c3f487a07564d2cc4820e54cd88',
                    otherParent: 'd3e16813aaf13981f527b1b42ad19c239a48695755094f52b25099a5eec2137d'
                },
                {
                    id: 'c11098c0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462655052,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'c297f8da5ed7a38cba60f4c86091c769d3aa08a98262a798534f0e47ef451524',
                    otherParent: 'dd73ab2e5bfc377673d633066c80ffbaad6c5c3f487a07564d2cc4820e54cd88'
                },
                {
                    id: 'c152aad0-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462655485,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '8b2bd81e9ab1f058e3a0ba36a2a2a0076d33b7f3e6f6cb5a299626d263d41511',
                    otherParent: '15261a72987f1599ddce34e8a07dbe757f87d43720014b52fdfa297363c75311'
                },
                {
                    id: 'c18330b0-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462655803,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'd3e16813aaf13981f527b1b42ad19c239a48695755094f52b25099a5eec2137d',
                    otherParent: 'ae6803b1480a70721233d520cdf14b370bdfd7a369228e79932064039e1ddf6e'
                },
                {
                    id: 'c1aa40b0-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462656059,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '243bd4488ebc39a6ed86bf19b3c87345aa75db1e87cd26b1de827382ed915dcb',
                    otherParent: '453295080440395c32d9084668b8d6dbd0d2985716514437967206baeb25db53'
                },
                {
                    id: 'c1af22b0-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462656091,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'ae6803b1480a70721233d520cdf14b370bdfd7a369228e79932064039e1ddf6e',
                    otherParent: '3b35bb747bfab17c5743dcf8de14a5d56410e11bb40aa922121ee30f394ec315'
                },
                {
                    id: 'c1d08d60-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462656310,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '15261a72987f1599ddce34e8a07dbe757f87d43720014b52fdfa297363c75311',
                    otherParent: '8df05c4cc2ac3031802cb829bd765f082f3a6ae2df5258a5e6101959c5b3de0a'
                },
                {
                    id: 'c1eca0e0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462656494,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '453295080440395c32d9084668b8d6dbd0d2985716514437967206baeb25db53',
                    otherParent: 'bd3a6dbfbca2452d8fa641489cf7b3281e96438ddc6fce6212e3cacc2bcbb353'
                },
                {
                    id: 'c1f72830-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462656563,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '8df05c4cc2ac3031802cb829bd765f082f3a6ae2df5258a5e6101959c5b3de0a',
                    otherParent: '11b2601266809c169b4968d51dd87e4ece32ee0607e3eef0b0aad4d440ed493f'
                },
                {
                    id: 'c21c8a80-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462656808,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '3b35bb747bfab17c5743dcf8de14a5d56410e11bb40aa922121ee30f394ec315',
                    otherParent: 'cbd0ef43a6def33f22f0196feda37453c1d66ce9bc59dd610701f1c8b743fd84'
                },
                {
                    id: 'c2476b10-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462657089,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'bd3a6dbfbca2452d8fa641489cf7b3281e96438ddc6fce6212e3cacc2bcbb353',
                    otherParent: 'eff4a945674afd04ab59cba5ef917cfdce141acb5f0b5112b0f54cc8626053ef'
                },
                {
                    id: 'c2847410-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462657489,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'eff4a945674afd04ab59cba5ef917cfdce141acb5f0b5112b0f54cc8626053ef',
                    otherParent: '31dcf689d96e52548776cb7e52d1cfd01e011c8d904b195ec6da6f65f6ade0fd'
                },
                {
                    id: 'c2942b80-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462657592,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'cbd0ef43a6def33f22f0196feda37453c1d66ce9bc59dd610701f1c8b743fd84',
                    otherParent: 'c4abfe2c91b254e767c3a7a220f4055a8e3bfecde85b3f0b79d31ae931d0ceb7'
                },
                {
                    id: 'c2b5bd40-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462657812,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '11b2601266809c169b4968d51dd87e4ece32ee0607e3eef0b0aad4d440ed493f',
                    otherParent: 'b8d666a6507f92865611fe33ab643a480870cbe0edbb235d50cb2239f1b9374f'
                },
                {
                    id: 'c2dca630-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462658067,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'c4abfe2c91b254e767c3a7a220f4055a8e3bfecde85b3f0b79d31ae931d0ceb7',
                    otherParent: '5eccab0fb5ee7cc75dff84ed55259ae10fb141ae86ff4e143128e9047ee5d862'
                },
                {
                    id: 'c2dfda80-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462658088,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'b8d666a6507f92865611fe33ab643a480870cbe0edbb235d50cb2239f1b9374f',
                    otherParent: '41b3dc71e8b377f9480ba2edc50508c02d764c985364070ef501ff49cace7346'
                },
                {
                    id: 'c302cbd0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462658317,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '31dcf689d96e52548776cb7e52d1cfd01e011c8d904b195ec6da6f65f6ade0fd',
                    otherParent: 'd71b904d1b8aafdf418064d8058cbe9dec5f11882394761826458b9d4644aa2d'
                },
                {
                    id: 'c31e9130-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462658499,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '41b3dc71e8b377f9480ba2edc50508c02d764c985364070ef501ff49cace7346',
                    otherParent: '4a740226ddf51a715806c3d47507908d60a73857ef6e8dcb51d1cb5e1f70f988'
                },
                {
                    id: 'c32d8550-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462658597,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '5eccab0fb5ee7cc75dff84ed55259ae10fb141ae86ff4e143128e9047ee5d862',
                    otherParent: '5ca959eb15f4a7a2bbc87568a07b8266d74530b3bc69a9aa0f5d2b7feb850f42'
                },
                {
                    id: 'c36adc70-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462658999,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'd71b904d1b8aafdf418064d8058cbe9dec5f11882394761826458b9d4644aa2d',
                    otherParent: '4a740226ddf51a715806c3d47507908d60a73857ef6e8dcb51d1cb5e1f70f988'
                },
                {
                    id: 'c3758ad0-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462659069,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '1e76cabf49b48492cd3cf096e96bf3dce4e7c94b90da3c0de81cac1ca4efd81f',
                    otherParent: 'b78788a4b0679dcc44c89d1719460635c24c4f98b3e4ca1e545577b467d10b4a'
                },
                {
                    id: 'c3e870e0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462659822,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'b78788a4b0679dcc44c89d1719460635c24c4f98b3e4ca1e545577b467d10b4a',
                    otherParent: '3b13dc512278025296ddaa94f49f5c152c0795b07af479e05f03af8f8c9c5dce'
                },
                {
                    id: 'c39bfe90-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462659321,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '5ca959eb15f4a7a2bbc87568a07b8266d74530b3bc69a9aa0f5d2b7feb850f42',
                    otherParent: '3b13dc512278025296ddaa94f49f5c152c0795b07af479e05f03af8f8c9c5dce'
                },
                {
                    id: 'c3c1d610-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462659570,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '4a740226ddf51a715806c3d47507908d60a73857ef6e8dcb51d1cb5e1f70f988',
                    otherParent: 'b78788a4b0679dcc44c89d1719460635c24c4f98b3e4ca1e545577b467d10b4a'
                },
                {
                    id: 'c3c5a6a0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462659594,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '3575240d63030410ec99f08164670e64013f75c3efccd748ac5cf70c8f11d523',
                    otherParent: '107cb929238fc3aed3f3ddadb84f97e30cdd92d91131a9b65f797a515388475d'
                },
                {
                    id: 'c404d280-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462660008,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '107cb929238fc3aed3f3ddadb84f97e30cdd92d91131a9b65f797a515388475d',
                    otherParent: '6bc28079a6f006233c593fddaaf5741ce26259e2f1b4d2b5ef0737058c53b950'
                },
                {
                    id: 'c42097e0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462660190,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: 'c802adf965fb14265005b50eb721181d78cfbf9bfce265bed3a730307fba003a',
                    otherParent: '23458d615b645e1cae166de9f156129bfb19102d8115d8b63c52dd5d7dd29243'
                },
                {
                    id: 'c4159b60-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462660118,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '23458d615b645e1cae166de9f156129bfb19102d8115d8b63c52dd5d7dd29243',
                    otherParent: 'c802adf965fb14265005b50eb721181d78cfbf9bfce265bed3a730307fba003a'
                },
                {
                    id: 'c46f7b30-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462660707,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '4db9c93f7209f7ff372e8b857ed8fd56e74c70d7f7bf0ea290ba9a04223ec70b',
                    otherParent: 'd6509bdba0cc1c1b666a312ce57d02bac1b5c6d4ee2aaaab35c4a8ce8bd68a37'
                },
                {
                    id: 'c460ae20-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462660611,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: '3b13dc512278025296ddaa94f49f5c152c0795b07af479e05f03af8f8c9c5dce',
                    otherParent: '4db9c93f7209f7ff372e8b857ed8fd56e74c70d7f7bf0ea290ba9a04223ec70b'
                },
                {
                    id: 'c48218d0-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462660829,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '03737cc5d97b76782f61e519e86423c1a9bd075ec1c9636418e8ce13022e1ffb',
                    otherParent: 'a8b166c17ad932e3ef5cfdf9494accba4127be62b7c04596adbc6d4b2653f7ce'
                },
                {
                    id: 'c4f462a0-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462661578,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'a8b166c17ad932e3ef5cfdf9494accba4127be62b7c04596adbc6d4b2653f7ce',
                    otherParent: '0329be59241e3a7396570e1f4db20afcefc79f309b78d17091c041e23b880854'
                },
                {
                    id: 'c4a901c0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462661084,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: '6bc28079a6f006233c593fddaaf5741ce26259e2f1b4d2b5ef0737058c53b950',
                    otherParent: '0329be59241e3a7396570e1f4db20afcefc79f309b78d17091c041e23b880854'
                },
                {
                    id: 'c4ebb010-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462661521,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: 'd6509bdba0cc1c1b666a312ce57d02bac1b5c6d4ee2aaaab35c4a8ce8bd68a37',
                    otherParent: 'b47468acced653de4881d9b7cd03e6cf5dd1b80a36e03cd2c2893829dc63f25a'
                },
                {
                    id: 'c4fbdcb0-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462661628,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'dbaebc733a257e4553b1e9f126a6570d4108e4ec1c6af29d25121877030a4613',
                    otherParent: '0fe166af6fd038fbf9cf06f364cc85769d004ac3d25543b15d1fa6bbddc529b8'
                },
                {
                    id: 'c51ad660-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462661830,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '0329be59241e3a7396570e1f4db20afcefc79f309b78d17091c041e23b880854',
                    otherParent: 'f3a0358b11d8089a8b277379efab32fe232a5a9664238094d84eeb548410ee2f'
                },
                {
                    id: 'c5412310-8106-11ec-8040-955d112498ee',
                    createdAt: 1643462662081,
                    publicKey: 'MCowBQYDK2VwAyEAJRxkAQWHVwiTywejQZ6p+wDcklhfhGr2i0mzOADR5aQ=',
                    selfParent: '0fe166af6fd038fbf9cf06f364cc85769d004ac3d25543b15d1fa6bbddc529b8',
                    otherParent: '183813b9beaae0ffcc96c51b573e3ddd6f918494fc743ad0c03ccd5d7ae85059'
                },
                {
                    id: 'c5487610-8106-11ec-8c62-21f072ea608b',
                    createdAt: 1643462662129,
                    publicKey: 'MCowBQYDK2VwAyEAOuPuwokD3AeThvA0SRbhVQ8ecuyd3WlAL7db3uOZVcY=',
                    selfParent: '183813b9beaae0ffcc96c51b573e3ddd6f918494fc743ad0c03ccd5d7ae85059',
                    otherParent: 'a481386a7d55c983bfc9a073b88f81d0e2987e16b2d87e08dad20f05f59641e6'
                },
                {
                    id: 'c58d6e50-8106-11ec-b95f-1fb35e8d9b64',
                    createdAt: 1643462662581,
                    publicKey: 'MCowBQYDK2VwAyEAnM25OxsE+x3wwld3yodvVORgkfDvouqhgj/3v6EJGSw=',
                    selfParent: 'f3a0358b11d8089a8b277379efab32fe232a5a9664238094d84eeb548410ee2f',
                    otherParent: '8bb9815195505772b37cc4ca2bf01f87c6cd1ccf23f7c0281050bbe806c126b9'
                },
                {
                    id: 'c595f9d0-8106-11ec-aea6-dd8cb70ec8b3',
                    createdAt: 1643462662637,
                    publicKey: 'MCowBQYDK2VwAyEA4HQmsnW9VQRYf+Q9iUIFWNqscObI7nbfSn6dOcauNDQ=',
                    selfParent: 'b47468acced653de4881d9b7cd03e6cf5dd1b80a36e03cd2c2893829dc63f25a',
                    otherParent: 'a481386a7d55c983bfc9a073b88f81d0e2987e16b2d87e08dad20f05f59641e6'
                },
            ];

            const main = () => {
                //
                const chunks = _.chunk(events, 4);

                for (let j = 0; j < chunks.length; j++) {
                    consensus.do(chunks[j]);
                }
            };

            expect(() => main()).not.toThrow();
        });

        describe('sets the round', () => {

            it('of an event to r when it a genesis event', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '1');

                expect(event.round).toBe(0);
            });

            it('of an event to r+1 when it can see the supermajority of witnesses in r', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '14');

                expect(event.round).toBe(1);
            });

            it('of an event to r when it can\'t see the supermajority of witnesses in r', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '11');

                expect(event.round).toBe(0);
            });
        });

        describe('sets the witness', () => {

            it('of an event to `true` when it is a genesis event', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '1');

                expect(event.witness).toBe(true);
            });

            it('of an event to `true` when it is the creator\'s first event in a round', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '14');

                expect(event.witness).toBe(true);
            });

            it('of an event to `false` when it is not the creator\'s first event in a round', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((cEvent) => cEvent.id === '16');

                expect(event.witness).toBe(false);
            });
        });


        describe('sets the famous', () => {

            it.each(['0', '1', '2', '3', '12', '13', '14'])(
                'of x=%i to `true` when it is famous',
                (id) => {
                    const cEvents = consensus.do(events);

                    const event = cEvents.find((cEvent) => cEvent.id === id);

                    expect(event.famous).toBe(true);
                }
            );

            it.each(['17'])(
                'of x=%i to `false` when it is not famous but voted on',
                (id) => {
                    const cEvents = consensus.do(events);

                    const event = cEvents.find((cEvent) => cEvent.id === id);

                    expect(event.famous).toBe(false);
                }
            );

            it.each(['7', '21'])(
                'of an event to undefined when it has not yet been voted on',
                (id) => {
                    const cEvents = consensus.do(events);

                    const event = cEvents.find((cEvent) => cEvent.id === id);

                    expect(event.famous).toBe(undefined);
                }
            );
        });


        describe('sets the received round', () => {

            it('of an event to r when all the famous witnesses in round r can see it', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((event) => event.id === '0');

                expect(event.roundReceived).toBe(1);
            });
        });

        describe('sets the timestamp', () => {

            it('of an event to the median timestamp of the creators\' event who saw it first', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((event) => event.id === '8');

                const median = cEvents.find((event) => event.id === '12');

                expect(event.timestamp).toEqual(median.createdAt);
            });
        });

        describe('sets the index', () => {

            it('of an event to 0 when it has the lowest median timestamp', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((event) => event.id === '1');

                expect(event.index).toBe(0)
            });

            it('of an event to 1 by comparing whithened signatures when timestamps are equal', () => {
                const cEvents = consensus.do(events);

                const event = cEvents.find((event) => event.id === '4');

                expect(event.index).toBe(1);
            });
        });
    });

    describe('helpers', () => {

        describe('canSee', () => {

            it('returns true when x and y are the same', () => {
                const x = h(events.find((event) => event.id === '0'));
                const y = h(events.find((event) => event.id === '0'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(true);
            });

            it('returns false when x is a genesis event', () => {
                const x = h(events.find((event) => event.id === '0'));
                const y = h(events.find((event) => event.id === '1'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(false);
            });

            it('returns true when y is a selfParent of x', () => {
                const x = h(events.find((event) => event.id === '8'));
                const y = h(events.find((event) => event.id === '0'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(true);
            });

            it('returns false when y is not a selfParent of x', () => {
                const x = h(events.find((event) => event.id === '8'));
                const y = h(events.find((event) => event.id === '13'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(false);
            });

            it('returns true when y is a otherParent of x', () => {
                const x = h(events.find((event) => event.id === '7'));
                const y = h(events.find((event) => event.id === '2'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(true);
            });

            it('returns false when y is not a otherParent of x', () => {
                const x = h(events.find((event) => event.id === '7'));
                const y = h(events.find((event) => event.id === '11'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(false);
            });

            it('returns true when y is a parent of a parent of x', () => {
                const x = h(events.find((event) => event.id === '11'));
                const y = h(events.find((event) => event.id === '6'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(true);
            });

            it('returns true when y is a parent of a parent of a parent of x', () => {
                const x = h(events.find((event) => event.id === '11'));
                const y = h(events.find((event) => event.id === '4'));

                const index = consensus.createIndex({}, events);

                const result = consensus.helpers.canSee(index, x, y);
                expect(result).toBe(true);
            });
        });

        describe('canStronglySee', () => {

            it.each([
                { xId: '12', yId: '0', expected: false },
                { xId: '12', yId: '1', expected: true },
                { xId: '12', yId: '2', expected: true },
                { xId: '12', yId: '3', expected: true }
            ])(
                'returns $expected when x=$xId and y=$yId',
                ({ xId, yId, expected }) => {
                    const x = h(events.find((event) => event.id === xId));
                    const y = h(events.find((event) => event.id === yId));

                    const index = consensus.createIndex({}, events);

                    const result = consensus.helpers.canStronglySee(index, x, y, 4);
                    expect(result).toBe(expected);
                },
            );
        });
    });

});