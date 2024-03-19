import Hashids from 'hashids';

export const hashIds = new Hashids(process.env.HASHIDS_SALT, 10);