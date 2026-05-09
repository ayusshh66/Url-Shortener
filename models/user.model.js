// import { varchar } from 'drizzle-orm/mysql-core'
// import { date } from 'drizzle-orm/mysql-core'
import {pgTable, uuid,varchar,text, timestamp} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
    id : uuid().primaryKey().defaultRandom(),

    firstname : varchar("First_Name",{length : 55}).notNull(),
    lastname : varchar("Last_Name", {length : 55}),

    email : text().notNull(),

    password : text().notNull(),
    salt : text().notNull(),
    
    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp("Updated_at").$onUpdate(()=> new Date())

})

export const urlsTable = pgTable('urls', {
    id: uuid().primaryKey().defaultRandom(),

    targetUrl: text('url').notNull(),

    shortCode: text('short_code').notNull().unique(),

    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})