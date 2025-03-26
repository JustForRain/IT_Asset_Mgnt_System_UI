<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button v-auth="'iams_iamsAccount_add'" class="ml10" icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            新 增
          </el-button>
          <el-button v-auth="'iams_iamsAccount_del'" :disabled="multiple" icon="Delete" plain
                     type="primary" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsAccount_export'"
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
        <el-table-column label="设备角色" prop="role" show-overflow-tooltip>
          <template #default="scope">
            <!-- 直接绑定样式 -->
            <div style="white-space: pre-line;">{{ scope.row.role }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" show-overflow-tooltip/>
        <el-table-column label="协议" prop="protocol" show-overflow-tooltip/>
        <el-table-column label="地址" prop="url" show-overflow-tooltip/>
        <el-table-column label="端口" prop="port" show-overflow-tooltip/>
        <el-table-column label="账号" prop="account" show-overflow-tooltip/>
        <el-table-column label="密码" prop="password" show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-auth="'iams_iamsAccount_edit'" icon="edit-pen" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button v-auth="'iams_iamsAccount_del'" icon="delete" text type="primary"
                       @click="handleDelete([scope.row.id])">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

  </div>
</template>

<script lang="ts" name="systemIamsAccount" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList} from "/@/api/iams/iamsAccount";
import {useMessage, useMessageBox} from "/@/hooks/message";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
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
  downBlobFile('/iams/iamsAccount/export', Object.assign(state.queryForm, {ids: selectObjs}), 'iamsAccount.xlsx')
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