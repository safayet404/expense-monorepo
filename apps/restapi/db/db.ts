import * as lodash from 'lodash';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export type User = {
    id: string,
    name: string,
    email: string,
    password: string
}
export type Currency = 'BDT' | 'USD' | 'EURO'

export type Account = {
    id: string,
    userId: string,
    balance: number,
    currency: Currency,
    lastUpdatedAt: Date

}

export type TransactionType = 'income' | 'expense' | 'transfer'

export type Transaction = {
    id: string,
    accountId: string,
    amount: number,
    type: TransactionType,
    lastBalance: number,
    createdAt: Date
}

export type DB = {
    users: User[],
    accounts: Account[],
    transactions: Transaction[]
}

class LowWithLodash<T> extends Low<T> {
    chain: any = this
}

const defaultData: DB = {
    users: [],
    accounts: [],
    transactions: []
}
const adapter = new JSONFile<DB>('db.json')

const db = new LowWithLodash(adapter, defaultData)