<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="品牌" prop="brandName">
            <el-input placeholder="请输入品牌" v-model="state.queryForm.brandName"/>
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input placeholder="请输入型号" v-model="state.queryForm.model"/>
          </el-form-item>
          <el-form-item label="序列号" prop="sn">
            <el-input placeholder="请输入序列号" v-model="state.queryForm.sn"/>
          </el-form-item>
          <el-form-item label="关联合同" prop="contractId">
            <el-select v-model="state.queryForm.contractId" placeholder="请选择关联合同">
              <el-option v-for="item in getiamsContractOption" :key="item.id" :label="item.projectName"
                         :value="item.id"/>

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'iams_iamsAsset_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
                     v-auth="'iams_iamsAsset_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsAsset_export'"
                         @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border
                :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" label="#" width="45"/>
        <el-table-column prop="brandName" label="品牌" show-overflow-tooltip/>
        <el-table-column prop="type" label="类型" show-overflow-tooltip/>
        <el-table-column prop="model" label="型号" show-overflow-tooltip/>
        <el-table-column prop="size" label="大小" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.size!=null?scope.row.size+'U' :'' }}
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="序列号" show-overflow-tooltip/>
        <el-table-column prop="projectName" label="关联合同" show-overflow-tooltip/>
        <el-table-column prop="roomName" label="所在机房" show-overflow-tooltip/>
        <el-table-column prop="moduleName" label="所在微模块" show-overflow-tooltip/>
        <el-table-column prop="cabinetName" label="所在机柜" show-overflow-tooltip/>
        <el-table-column prop="shelfName" label="所在机架" show-overflow-tooltip/>
        <el-table-column prop="roleName" label="设备角色" show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'iams_iamsAsset_edit'"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button icon="delete" text type="primary" v-auth="'iams_iamsAsset_del'"
                       @click="handleDelete([scope.row.id])">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

  </div>
</template>

<script setup lang="ts" name="systemIamsAsset">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObjs} from "/@/api/iams/iamsAsset";
import {fetchList as fetchListContract} from '/@/api/iams/iamsContract'

import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const loading = ref(false)

// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/iams/iamsAsset/export', Object.assign(state.queryForm, {ids: selectObjs}), 'iamsAsset.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({id}) => id);
  multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

//初始化合同列表
const getiamsContractOption = ref();
onMounted(() => {
  getiamsContractData()
})
const getiamsContractData = () => {
  // 获取数据
  loading.value = true
  fetchListContract().then((res: any) => {
    getiamsContractOption.value=res.data.records
  }).finally(() => {
    loading.value = false
  })
};
</script>