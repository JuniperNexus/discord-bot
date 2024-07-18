import { db, EventTable, InsertEvent, SelectEvent } from '../index';

export const createEvent = async (eventName: InsertEvent['event_name']) => {
    await db.insert(EventTable).values({ event_name: eventName });
};

export const getEvents = async (): Promise<Array<SelectEvent>> => {
    const events = await db.select().from(EventTable);

    return events;
};
