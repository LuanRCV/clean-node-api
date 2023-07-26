import { MongoClient } from 'mongodb'

export class MongoHelper {
  static client: MongoClient

  static async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }
}
