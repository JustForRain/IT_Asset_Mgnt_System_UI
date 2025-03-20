import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/iams/iamsShelf/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/iams/iamsShelf',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/iams/iamsShelf/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/iams/iamsShelf',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/iams/iamsShelf',
    method: 'put',
    data: obj
  })
}

export function fetchPutOnList(cabinetId?: string){
  return request({
    url: '/iams/iamsShelf/puton/' + cabinetId,
    method: 'get'
  })
}

export function pullOff(assetIds?: Object){
  return request({
    url: '/iams/iamsShelf/pulloff',
    method: 'delete',
    data: assetIds
  })
}

