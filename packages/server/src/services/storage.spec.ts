import { Database } from 'sqlite3';
import { Storage } from '../services/_';
import { Transaction } from '../types/_';

describe('Storage', () => {
    //
    let database: Database;
    let storage: Storage;

    beforeEach(() => {
        // Initialise a new in-memory database for every test.
        database = new Database(':memory:');
        storage = new Storage(database);
    });

    describe('transactions', () => {
        const id = 'mock-id';
        const index = 0;
        const order = 1;
        const timestamp = Date.now();
        const sender = 'mock-sender';
        const receiver = 'mock-receiver';
        const amount = 1;

        const items: Transaction[] = [
            { id: `${id}-0`, index: index + 0, order, timestamp, sender: `${sender}-0`, receiver: `${receiver}-0`, amount },
            { id: `${id}-1`, index: index + 1, order, timestamp, sender: `${sender}-1`, receiver: `${receiver}-1`, amount },
            { id: `${id}-2`, index: index + 2, order, timestamp, sender: `${sender}-2`, receiver: `${receiver}-2`, amount },
        ];

        describe('index', () => {

            it('should call database.all', async () => {
                const spy = jest.spyOn(database, 'all');

                await storage.transactions.index();

                expect(spy).toBeCalled();
            });

            it('should return a populated list when items are stored in the database', async () => {
                database.serialize(() => {
                    const statement = database.prepare('INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');

                    items.forEach((transaction) => {
                        statement.run(transaction.id, transaction.timestamp, transaction.index, transaction.order, transaction.receiver, transaction.sender, transaction.amount);
                    });

                    statement.finalize();
                });

                const result = await storage.transactions.index();

                expect(result.length).toEqual(items.length);
            });

            it('should only return the transactions of the provided public key', async () => {
                database.serialize(() => {
                    const statement = database.prepare('INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');

                    items.forEach((transaction) => {
                        statement.run(transaction.id, transaction.timestamp, transaction.index, transaction.order, transaction.receiver, transaction.sender, transaction.amount);
                    });

                    statement.finalize();
                });

                const result = await storage.transactions.index('mock-sender-0');

                expect(result.length).toEqual(1);
            });

            it('should order the transactions by index descending', async () => {
                database.serialize(() => {
                    const statement = database.prepare('INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');

                    items.forEach((transaction) => {
                        statement.run(transaction.id, transaction.timestamp, transaction.index, transaction.order, transaction.receiver, transaction.sender, transaction.amount);
                    });

                    statement.finalize();
                });

                const result = await storage.transactions.index();

                const indexes = result.map((transaction) => transaction.index);

                expect(indexes).toEqual([2, 1, 0]);
            });

            it('should limit the number of transactions when limit is provided', async () => {
                database.serialize(() => {
                    const statement = database.prepare('INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');

                    items.forEach((transaction) => {
                        statement.run(transaction.id, transaction.timestamp, transaction.index, transaction.order, transaction.receiver, transaction.sender, transaction.amount);
                    });

                    statement.finalize();
                });

                const result = await storage.transactions.index(null, 1);

                expect(result.length).toBe(1);
            });

            it('should start at the transaction which is right after offset', async () => {
                database.serialize(() => {
                    const statement = database.prepare('INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');

                    items.forEach((transaction) => {
                        statement.run(transaction.id, transaction.timestamp, transaction.index, transaction.order, transaction.receiver, transaction.sender, transaction.amount);
                    });

                    statement.finalize();
                });

                const result = await storage.transactions.index(null, 3, 2);

                expect(result.length).toBe(1);
            });
        });
    });
});

// import { Database } from 'sqlite3';
// import { Address, Event } from '../../types';
// import { StorageService } from './index';

// describe('StorageService', () => {
// 	//
// 	let database: Database;
// 	let storage: StorageService;

// 	beforeEach(() => {
// 		// Initialise a new in-memory datbase for every test.
// 		database = new Database(':memory:');
// 		storage = new StorageService(database);
// 	});

// 	describe('addresses', () => {
// 		const publicKey = 'mock-public-key';
// 		const privateKey = 'mock-private-key';
// 		const isDefault = 0;

// 		const items: Address[] = [
// 			{ publicKey: `${publicKey}-1`, privateKey: privateKey, isDefault: isDefault },
// 			{ publicKey: `${publicKey}-2`, privateKey: privateKey, isDefault: isDefault },
// 			{ publicKey: `${publicKey}-3`, privateKey: privateKey, isDefault: isDefault }
// 		];

// 		describe('index', () => {

// 			it('should call database.all', async () => {
// 				const spy = jest.spyOn(database, 'all');

// 				await storage.addresses.index();

// 				expect(spy).toBeCalled();
// 			});

// 			it('should return an empty list when no items are stored in the database', async () => {
// 				const result = await storage.addresses.index();

// 				expect(result.length).toEqual(0);
// 			});

			// it('should return a populated list when items are stored in the database', async () => {
			// 	// Add via the databse directly.
			// 	database.serialize(() => {
			// 		const statement = database.prepare('INSERT INTO addresses VALUES (?, ?, ?)');

			// 		items.forEach((address) => {
			// 			statement.run(address.publicKey, address.privateKey, address.isDefault);
			// 		});

			// 		statement.finalize();
			// 	});

			// 	const result = await storage.addresses.index();

			// 	expect(result.length).toEqual(items.length);
			// });
// 		});

// 		describe('read', () => {

// 			it('should call database.get', async () => {
// 				const spy = jest.spyOn(database, 'get');

// 				await storage.addresses.read(publicKey);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should return undefined when the item was not found', async () => {
// 				const result = await storage.addresses.read(publicKey);

// 				expect(result).toBeUndefined();
// 			});

// 			it('should return the correct item', async () => {
// 				// Add via the databse directly.
// 				database.serialize(() => {
// 					const statement = database.prepare('INSERT INTO addresses VALUES (?, ?, ?)');

// 					items.forEach((address) => {
// 						statement.run(address.publicKey, address.privateKey, address.isDefault);
// 					});

// 					statement.finalize();
// 				});

// 				const item = items[0];

// 				const result = await storage.addresses.read(item.publicKey);

// 				expect(result.publicKey).toEqual(item.publicKey);
// 				expect(result.privateKey).toEqual(item.privateKey);
// 				expect(result.isDefault).toEqual(item.isDefault);
// 			});
// 		});

// 		describe('create', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.addresses.create(publicKey, privateKey, isDefault);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should create and store the item in the database', async () => {
// 				const item = items[0];

// 				await storage.addresses.create(item.publicKey, item.privateKey, item.isDefault);

// 				// Read from the databse directly.
// 				database.serialize(() => {

// 					database.get(
// 						'SELECT * FROM addresses WHERE publicKey=?',
// 						[item.publicKey],
// 						(_, res) => {
// 							const result: Address = res;

// 							expect(result.publicKey).toEqual(item.publicKey);
// 							expect(result.privateKey).toEqual(item.privateKey);
// 							expect(result.isDefault).toEqual(item.isDefault);
// 						}
// 					);
// 				});
// 			});

// 			it('should throw an error when the public key already exists', async () => {
// 				// Add via the databse directly.
// 				database.run(
// 					'INSERT INTO addresses VALUES (?, ?, ?)',
// 					[publicKey, privateKey, isDefault]
// 				);

// 				expect(() => storage.addresses.create(publicKey, privateKey, isDefault)).rejects;
// 			});
// 		});

// 		describe('update', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.addresses.update(publicKey, isDefault);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should update the item in the database', async () => {
// 				// Add via the databse directly.
// 				database.run(
// 					'INSERT INTO addresses VALUES (?, ?, ?)',
// 					[publicKey, privateKey, isDefault],
// 				);

// 				await storage.addresses.update(publicKey, 1);

// 				const result = await storage.addresses.read(publicKey);

// 				expect(result.isDefault).toEqual(1);
// 			});
// 		});

// 		describe('destroy', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.addresses.destroy(publicKey);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should delete the item from the database', async () => {
// 				const item = items[0];

// 				// Add via the databse directly.
// 				database.run(
// 					'INSERT INTO addresses VALUES (?, ?, ?)',
// 					[item.publicKey, item.privateKey, item.isDefault],
// 				);

// 				await storage.addresses.destroy(publicKey);

// 				// Read from the databse directly.
// 				database.serialize(() => {

// 					database.get(
// 						'SELECT * FROM addresses WHERE publicKey=?',
// 						[item.publicKey],
// 						(_, res) => {
// 							const result: Address = res;

// 							expect(result.publicKey).toEqual(item.publicKey);
// 							expect(result.privateKey).toEqual(item.privateKey);
// 							expect(result.isDefault).toEqual(item.isDefault);
// 						}
// 					);
// 				});
// 			});
// 		});
// 	});

// 	describe('events', () => {
// 		const type = 'transaction';
// 		const data = {};
// 		const otherParent = 'mock-other-parent';
// 		const selfParent = 'mock-self-parent';
// 		const signature = 'mock-signature';
// 		const date = new Date();
// 		const consensusReached = false;

// 		const items: Event[] = [
// 			{ type: type, signature: `${signature}1`, selfParent: selfParent, otherParent: otherParent, date: date, data: data, consensusReached: consensusReached },
// 			{ type: type, signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: data, consensusReached: consensusReached },
// 			{ type: type, signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: data, consensusReached: consensusReached }
// 		];

// 		describe('index', () => {

// 			it('should call database.all', async () => {
// 				const spy = jest.spyOn(database, 'all');

// 				await storage.events.index();

// 				expect(spy).toBeCalled();
// 			});

// 			it('should return an empty list when no items are stored in the database', async () => {
// 				const result = await storage.events.index();

// 				expect(result).toEqual(result);
// 			});

// 			it('should return a populated list when items are stored in the database', async () => {
// 				// Add via the databse directly.
// 				database.serialize(() => {
// 					const statement = database.prepare('INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)');

// 					items.forEach((event) => {
// 						statement.run(event.type, event.data, event.otherParent, event.selfParent, event.signature, event.date);
// 					});

// 					statement.finalize();
// 				});

// 				const result = await storage.events.index();

// 				expect(result.length).toEqual(3);
// 			});
// 		});

// 		describe('read', () => {

// 			it('should call database.get', async () => {
// 				const spy = jest.spyOn(database, 'get');

// 				await storage.events.read(0);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should return undefined when the item was not found', async () => {
// 				const result = await storage.events.read(0);

// 				expect(result === undefined).toBeTruthy();
// 			});

// 			it('should return the correct item', async () => {
// 				// Add via the databse directly.
// 				database.serialize(() => {
// 					const statement = database.prepare('INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)');

// 					items.forEach((event) => {
// 						statement.run(event.type, event.data, event.otherParent, event.selfParent, event.signature, event.date);
// 					});

// 					statement.finalize();
// 				});

// 				const item = items[0];

// 				const result = await storage.events.read(1);

// 				expect(result.type).toEqual(item.type);
// 				expect(result.signature).toEqual(item.signature);
// 				expect(result.selfParent).toEqual(item.selfParent);
// 				expect(result.otherParent).toEqual(item.otherParent);
// 			});
// 		});

// 		describe('create', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.events.create(type, data, otherParent, selfParent, signature, date);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should create and store the item in the database', async () => {
// 				const item = items[0];

// 				await storage.events.create(item.type, item.data, item.otherParent, item.selfParent, item.signature, item.date);

// 				// Read from the databse directly.
// 				database.serialize(() => {

// 					database.get(
// 						'SELECT * FROM events WHERE id=?',
// 						[1],
// 						(_, res) => {
// 							const result: Event = res;

// 							expect(result.type).toEqual(item.type);
// 							expect(result.signature).toEqual(item.signature);
// 							expect(result.selfParent).toEqual(item.selfParent);
// 							expect(result.otherParent).toEqual(item.otherParent);
// 						}
// 					);
// 				});
// 			});
// 		});

// 		describe('update', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.events.update(1, date);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should update the item in the database', async () => {
// 				const item = items[0];

// 				// Add via the databse directly.
// 				database.run(
// 					'INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)',
// 					[item.type, item.data, item.otherParent, item.selfParent, item.signature, undefined],
// 				);

// 				await storage.events.update(1, new Date());

// 				const result = await storage.events.read(1);

// 				expect(result.date).not.toBeUndefined();
// 			});
// 		});

// 		describe('destroy', () => {

// 			it('should call database.run', async () => {
// 				const spy = jest.spyOn(database, 'run');

// 				await storage.events.destroy(1);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should delete the item from the database', async () => {
// 				const item = items[0];

// 				// Add via the databse directly.
// 				database.run(
// 					'INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)',
// 					[item.type, item.data, item.otherParent, item.selfParent, item.signature, undefined],
// 				);

// 				await storage.events.destroy(1);

// 				// Read from the databse directly.
// 				database.serialize(() => {

// 					database.get(
// 						'SELECT * FROM events WHERE id=?',
// 						[1],
// 						(_, res) => {
// 							expect(res).toBeUndefined();
// 						}
// 					);
// 				});
// 			});
// 		});
// 	});

// 	describe('nodes', () => {

// 		describe('index', () => {

// 			it.todo('should call database.all');

// 			it.todo('should return an empty list when no items are stored in the database');

// 			it.todo('should return a populated list when items are stored in the database');
// 		});

// 		describe('read', () => {

// 			it.todo('should call database.get');

// 			it.todo('should return undefined when the item was not found');

// 			it.todo('should return the correct item');
// 		});

// 		describe('create', () => {

// 			it.todo('should call database.run');

// 			it.todo('should create and store the item in the database');

// 			it.todo('should throw an error when the host already exists');
// 		});

// 		describe('update', () => {

// 			it.todo('should call database.run');

// 			it.todo('should update the item in the database');
// 		});

// 		describe('destroy', () => {

// 			it.todo('should call database.run');

// 			it.todo('should delete the item from the database');
// 		});
// 	});

// 	describe('states', () => {

// 		describe('index', () => {

// 			it.todo('should call database.all');

// 			it.todo('should return an empty list when no items are stored in the database');

// 			it.todo('should return a populated list when items are stored in the database');
// 		});

// 		describe('read', () => {

// 			it.todo('should call database.get');

// 			it.todo('should return undefined when the item was not found');

// 			it.todo('should return the correct item');
// 		});

// 		describe('create', () => {

// 			it.todo('should call database.run');

// 			it.todo('should create and store the item in the database');

// 			it.todo('should throw an error when the address already exists');
// 		});

// 		describe('update', () => {

// 			it.todo('should call database.run');

// 			it.todo('should update the item in the database');
// 		});

// 		describe('destroy', () => {

// 			it.todo('should call database.run');

// 			it.todo('should delete the item from the database');
// 		});
// 	});

// 	describe('transactions', () => {
// 		const publicKey = 'mock-public-key';
// 		const type = 'transaction';
// 		const otherParent = 'mock-other-parent';
// 		const selfParent = 'mock-self-parent';
// 		const signature = 'mock-signature';
// 		const date = new Date();
// 		const consensusReached = false;

// 		describe('index', () => {

// 			it('should call database.all', async () => {
// 				const spy = jest.spyOn(database, 'all');

// 				await storage.transactions.index(publicKey);

// 				expect(spy).toBeCalled();
// 			});

// 			it('should return an empty list when no items are stored in the database', async () => {
// 				const result = await storage.transactions.index(publicKey);

// 				expect(result.length).toBe(0);
// 			});

// 			it('should only return events of type \'transastion\'', async () => {
// 				const items: Event[] = [
// 					{ type: 'transaction', signature: `${signature}1`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: publicKey }, consensusReached: consensusReached },
// 					{ type: 'transaction', signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: publicKey }, consensusReached: consensusReached },
// 					{ type: 'state', signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: publicKey }, consensusReached: consensusReached }
// 				];

// 				// Add via the databse directly.
// 				database.serialize(() => {
// 					const statement = database.prepare('INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)');

// 					items.forEach((event) => {
// 						const stringData = JSON.stringify(event.data);

// 						statement.run(event.type, stringData, event.otherParent, event.selfParent, event.signature, event.date);
// 					});

// 					statement.finalize();
// 				});

// 				const result = await storage.transactions.index(publicKey);

// 				expect(result.length).toEqual(2);
// 			});

// 			it('should only return events associated with the provided public key', async () => {
// 				const items: Event[] = [
// 					{ type: type, signature: `${signature}1`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: publicKey }, consensusReached: consensusReached },
// 					{ type: type, signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: 'other-public-key' }, consensusReached: consensusReached },
// 					{ type: type, signature: `${signature}2`, selfParent: selfParent, otherParent: otherParent, date: date, data: { from: publicKey }, consensusReached: consensusReached }
// 				];

// 				// Add via the databse directly.
// 				database.serialize(() => {
// 					const statement = database.prepare('INSERT INTO events (type, data, otherParent, selfParent, signature, date) VALUES (?, ?, ?, ?, ?, ?)');

// 					items.forEach((event) => {
// 						const stringData = JSON.stringify(event.data);

// 						statement.run(event.type, stringData, event.otherParent, event.selfParent, event.signature, event.date);
// 					});

// 					statement.finalize();
// 				});

// 				const result = await storage.transactions.index(publicKey);

// 				expect(result.length).toEqual(2);
// 			});
// 		});
// 	});
// });