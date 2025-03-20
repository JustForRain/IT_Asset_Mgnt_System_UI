import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/iams/iamsCabinet/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/iams/iamsCabinet',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/iams/iamsCabinet/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/iams/iamsCabinet',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/iams/iamsCabinet',
    method: 'put',
    data: obj
  })
}

export function getUnit(id?: string) {
  return request({
    url: '/iams/iamsCabinet/unit/' + id,
    method: 'get'
  })
}

export function getUnitDetail(id?: string) {
  return request({
    url: '/iams/iamsCabinet/unit/detail/' + id,
    method: 'get'
  })
}

