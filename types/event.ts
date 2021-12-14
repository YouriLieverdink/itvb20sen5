/**
 * An event in the hashgraph
 */
export type Event = {
    // When the message was created.
    type: 'TRANSACTION'|'JOIN'|'STATE';
    // The content of the message.
    data: Object;
    // The hash of the user who received the message.
    selfParent: string;
    // The hash of the user who received the message.
    otherParent: string;
    // The signature of the user who originally send the message.
    signature: string;
    // When the message was created.
    date: Date;
};
