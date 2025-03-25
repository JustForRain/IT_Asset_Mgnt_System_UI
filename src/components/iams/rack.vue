<template>
  <div class="rack">
    <el-form v-loading="loading">
      <div class="title">{{ title }}</div>
      <el-table
          :cell-style="tableStyle.cellStyle"
          :data="unitDetails"
          :header-cell-style="tableStyle.headerCellStyle"
          :row-style="rowStyleFunc"
          :span-method="objectSpanMethod"
          border
          @cell-click="deviceCellHandle"
      >
        <el-table-column label="编号" prop="unitNum"/>
        <el-table-column label="设备名称" prop="deviceName">
          <template #default="scope">
            <DeviceCard :device="scope.row.device"/>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="unitNum"/>
      </el-table>
    </el-form>
    <device-detail-dialog ref="deviceDetailDialogRef"/>
  </div>
</template>

<script lang="ts" setup>
import DeviceCard from '/@/views/iams/iamsCabinet/DeviceCard.vue'
import {BasicTableProps, useTable} from "/@/hooks/table";
import type {TableColumnCtx} from "element-plus";
import {getUnitDetail} from "/@/api/iams/iamsCabinet";

const loading = ref(false)
const state: BasicTableProps = reactive<BasicTableProps>({})
const {
  tableStyle
} = useTable(state)
const props = defineProps({
  id: {
    type: String
  }
});

const unitDetails = ref([])
const title = ref("")
const DeviceDetailDialog = defineAsyncComponent(() => import('./deviceDetail.vue'));

const deviceDetailDialogRef = ref()
onMounted(() => {
  loading.value = true
  getUnitDetail(props.id).then((res: any) => {
    // 标题
    title.value = res.data.cabinetName
    unitDetails.value = res.data.unitDetails
    computeSpanArr();
  }).finally(() => {
    loading.value = false
  })
})
//合并行数
const spanArr = [];
const computeSpanArr = () => {
  let pos = 0; // 当前位置
  while (pos < unitDetails.value.length) {
    // 当前assetId的连续数量
    let count = 1;
    const current = unitDetails.value[pos].device;

    // 新增判断：跳过 undefined 的情况
    if (current == null) {
      spanArr[pos] = 1; // 独立成行不合并
      pos++;
      continue; // 跳过后续处理
    }
    // 检查后续行是否相同
    while (pos + count < unitDetails.value.length && unitDetails.value[pos + count].device && unitDetails.value[pos + count].device.assetId === current.assetId) {
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
const objectSpanMethod = ({
                            row,//当前行
                            column,//当前列
                            rowIndex,//当前行号
                            columnIndex,//当前列号
                          }: Object) => {
// 只在 assetId 列（第2列）合并
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
const rowStyleFunc = (row: any, rowIndex: number, column: TableColumnCtx<any>, columnIndex: number) => {
  if (row.row.device) {
    return {
      backgroundColor: 'gray',
      color: 'white'
    }
  }
  return {};
}
const deviceCellHandle = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (row.device !== null && typeof row.device.id !== 'undefined') {
    deviceDetailDialogRef.value.openDialog(row.device.id)
  }
}
</script>

<style lang="scss" scoped>
.rack {
  text-align: center;
  border: 5px solid #ccc; /* 增加边框 */
  padding: 10px; /* 可选：增加内边距 */
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>