import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/iams/iamsPasswordLog/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/iams/iamsPasswordLog',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/iams/iamsPasswordLog/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/iams/iamsPasswordLog',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/iams/iamsPasswordLog',
    method: 'put',
    data: obj
  })
}

