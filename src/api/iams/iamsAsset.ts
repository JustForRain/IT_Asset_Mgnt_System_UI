import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/iams/iamsAsset/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/iams/iamsAsset',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/iams/iamsAsset/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/iams/iamsAsset',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/iams/iamsAsset',
    method: 'put',
    data: obj
  })
}

export function fetchListNoPage(query?: Object) {
  return request({
    url: '/iams/iamsAsset/nopage',
    method: 'get',
    params: query
  })
}

