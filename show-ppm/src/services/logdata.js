import request from '../utils/request';

export function findAllCount() {
  return request('127.0.0.1:10800/api/data/findAllCount');
}
