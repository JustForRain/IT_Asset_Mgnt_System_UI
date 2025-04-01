<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
          <el-form-item label="所属微模块" prop="moduleId">
            <el-select v-model="state.queryForm.moduleId"
                       :remote-method="fetchModuleListHandler"
                       allow-create clearable
                       filterable placeholder="请选择所属微模块" remote reserve-keyword>
              <el-option v-for="item in moduleList" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所在行" prop="rowNum">
            <el-input v-model="state.queryForm.rowNum" placeholder="请输入所在行"/>
          </el-form-item>
          <el-form-item label="所在列" prop="columnNum">
            <el-input v-model="state.queryForm.columnNum" placeholder="请输入所在列"/>
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
          <el-button v-auth="'iams_iamsCabinet_add'" class="ml10" icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            新 增
          </el-button>
          <el-button v-auth="'iams_iamsCabinet_del'" :disabled="multiple" icon="Delete" plain
                     type="primary" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsCabinet_export'"
                         class="ml10 mr20" style="float: right;" @exportExcel="exportExcel"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :cell-style="tableStyle.cellStyle" :data="state.dataList"
                :header-cell-style="tableStyle.headerCellStyle" border
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column label="#" type="index" width="40"/>
        <el-table-column label="所属微模块" prop="moduleName" show-overflow-tooltip/>
        <el-table-column label="大小" prop="size" show-overflow-tooltip/>
        <el-table-column label="所在行" prop="rowNum" show-overflow-tooltip/>
        <el-table-column label="所在列" prop="columnNum" show-overflow-tooltip/>
        <el-table-column label="名称" prop="name" show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-auth="'iams_iamsCabinet_edit'" icon="edit-pen" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button v-auth="'iams_iamsCabinet_del'" icon="delete" text type="primary"
                       @click="handleDelete([scope.row.id])">删除
            </el-button>
            <el-button v-auth="'iams_iamsCabinet_del'" icon="plus" text type="primary"
                       @click="putOnDialogRef.openDialog(scope.row.id)">上架
            </el-button>
            <el-button v-auth="'iams_iamsCabinet_del'" icon="minus" text type="primary"
                       @click="pullOffDialogRef.openDialog(scope.row.id)">下架
            </el-button>
            <el-button v-auth="'iams_iamsCabinet_del'" icon="view" text type="primary"
                       @click="cabinetDetailDialogRef.openDialog(scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

    <!-- 上架  -->
    <put-on-dialog ref="putOnDialogRef" @refresh="getDataList(false)"/>

    <!-- 下架  -->
    <pull-off-dialog ref="pullOffDialogRef" @refresh="getDataList(false)"/>

    <!-- 机柜详情  -->
    <cabinet-detail-dialog ref="cabinetDetailDialogRef"/>

  </div>
</template>

<script lang="ts" name="systemIamsCabinet" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList} from "/@/api/iams/iamsCabinet";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {fetchList as fetchModuleList} from "/@/api/iams/iamsModule";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const PutOnDialog = defineAsyncComponent(() => import('./puton.vue'));
const PullOffDialog = defineAsyncComponent(() => import('./pulloff.vue'));
const cabinetDetailDialog = defineAsyncComponent(() => import('./cabinetDetail.vue'))
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const putOnDialogRef = ref()
const pullOffDialogRef = ref()
const cabinetDetailDialogRef = ref()
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
const moduleList = ref([])
onMounted(() => {
  moduleList.value = [];
  fetchModuleListHandler()
})
//微模块远程搜索
const loading = ref(false)
const fetchModuleListHandler = (val: string) => {
  try {
    loading.value = true;
    fetchModuleList({"name": val}).then((res) => {
      moduleList.value = []
      console.log(res.data.records)
      res.data.records.forEach((item: any) => {
        moduleList.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
  } finally {
    loading.value = false;
  }
}
// 导出excel
const exportExcel = () => {
  downBlobFile('/iams/iamsCabinet/export', Object.assign(state.queryForm, {ids: selectObjs}), 'iamsCabinet.xlsx')
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
</script>