import { type AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helpers/mongo'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const account = result.ops[0]

    return MongoHelper.mapEntity<AccountModel>(account)
  }
}
