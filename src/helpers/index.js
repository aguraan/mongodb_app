import * as crypto from 'crypto'

export const createHash = key => crypto.createHash('sha256').update(key).digest('hex')