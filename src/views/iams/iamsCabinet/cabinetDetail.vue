<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="title" draggable width="30%">
    <el-form v-loading="loading">
      <el-table
          :cell-style="tableStyle.cellStyle"
          :data="tableData"
          :header-cell-style="tableStyle.headerCellStyle"
          :span-method="objectSpanMethod" border
          :row-style="rowStyleFunc"
          highlight-current-row
      >
        <el-table-column label="编号" prop="unitNum"/>
        <el-table-column label="设备名称" prop="deviceName">
          <template #default="scope">
            <DeviceCard :message="scope.row.device"/>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="unitNum"/>
      </el-table>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {getUnitDetail} from "/@/api/iams/iamsCabinet";
import type {TableColumnCtx} from 'element-plus'
import DeviceCard from './DeviceCard.vue'

const loading = ref(false)

const visible = ref(false)
const state: BasicTableProps = reactive<BasicTableProps>({})
const tableData = ref([])
const title = ref("")
//  table hook
const {
  tableStyle
} = useTable(state)
// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  tableData.value = []
  getiamsCabinetDetailData(id)
};
//从后端获取机柜详细数据
const getiamsCabinetDetailData = (id: string) => {
  // 获取数据
  loading.value = true
  getUnitDetail(id).then((res: any) => {
    // 标题
    title.value = res.data.cabinetName + "机柜详情"
    //生成机架
    for (let i = 1; i <= res.data.size; i++) {
      tableData.value.push({
        unitNum: i,
      })
    }
    //上架设备
    for (let i = 0; i < res.data.shelfs.length; i++) {
      let device = res.data.shelfs[i]
      //遍历tabledate 如果unitNum在设备的unitStart和unitEnd范围内，则设置单元格为设备名称
      tableData.value.forEach((item: any) => {
        if (item.unitNum >= device.unitStart && item.unitNum <= device.unitEnd) {
          // item.deviceName = device.deviceName
          item.device = device
        }
      })
    }
    computeSpanArr();
  }).finally(() => {
    loading.value = false
  })
}

const rowStyleFunc = (row: any, rowIndex: number, column: TableColumnCtx<any>, columnIndex: number) => {
  if (row.row.device) {
    return {
      backgroundColor: 'gray',
      color: 'white'
    }
  }
  return {};
}

const spanArr = [];
const computeSpanArr = () => {
  let pos = 0; // 当前位置
  while (pos < tableData.value.length) {
    // 当前assetId的连续数量
    let count = 1;
    const current = tableData.value[pos].device;

    // 新增判断：跳过 undefined 的情况
    if (typeof current === 'undefined') {
      spanArr[pos] = 1; // 独立成行不合并
      pos++;
      continue; // 跳过后续处理
    }
    // 检查后续行是否相同
    while (pos + count < tableData.value.length && tableData.value[pos + count].device && tableData.value[pos + count].device.assetId === current.assetId) {
      count++;
    }
    // 记录合并数（起始位置）
    spanArr[pos] = count;
    // 后续位置标记为0（不显示）
    for (let i = 1; i < count; i++) {
      spanArr[pos + i] = 0;
    }
    pos += count; // 跳到下一组
  }
}
//合并行数
const objectSpanMethod = ({
                            row,//当前行
                            column,//当前列
                            rowIndex,//当前行号
                            columnIndex,//当前列号
                          }: Object) => {
// 只在 assetId 列（第3列）合并
  if (columnIndex === 1) {
    const span = spanArr[rowIndex];
    if (span > 0) {
      return {rowspan: span, colspan: 1};
    } else {
      return {rowspan: 0, colspan: 0}; // 隐藏单元格
    }
  }
  // 其他列保持默认
  return {rowspan: 1, colspan: 1};
}

// 暴露变量
defineExpose({
  openDialog
});
</script>


<style lang="scss" scoped>
</style>