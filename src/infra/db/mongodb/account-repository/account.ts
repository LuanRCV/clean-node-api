import { type AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { type LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]

    return MongoHelper.mapEntity<AccountModel>(account)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.mapEntity<AccountModel>(account)
    }

    return null
  }
}
