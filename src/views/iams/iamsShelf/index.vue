<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
          <el-form-item label="所在机房" prop="room">
            <el-input v-model="state.queryForm.room" placeholder="请选择所在机房"/>
          </el-form-item>
          <el-form-item label="所在微模块" prop="module">
            <el-input v-model="state.queryForm.module" placeholder="请选择所在微模块"/>
          </el-form-item>
          <el-form-item label="所在机柜" prop="cabinet">
            <el-input v-model="state.queryForm.cabinet" placeholder="请选择所在机柜"/>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="state.queryForm.projectName" placeholder="请输入项目名称"/>
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
          <el-button v-auth="'iams_iamsShelf_add'" class="ml10" icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            新 增
          </el-button>
          <el-button v-auth="'iams_iamsShelf_del'" :disabled="multiple" icon="Delete" plain
                     type="primary" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsShelf_export'"
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
        <el-table-column label="所在机房" prop="room" show-overflow-tooltip/>
        <el-table-column label="所在微模块" prop="module" show-overflow-tooltip/>
        <el-table-column label="所在机柜" prop="cabinet" show-overflow-tooltip/>
        <el-table-column label="所在机架" prop="shelf" show-overflow-tooltip/>
        <!--          <el-table-column prop="cabinetId" label="机柜编号"  show-overflow-tooltip/>-->
        <el-table-column label="设备角色" prop="role" show-overflow-tooltip/>
        <!--          <el-table-column prop="assetId" label="资产编号"  show-overflow-tooltip/>-->
        <!--        <el-table-column prop="shelfName" label="所在机架" show-overflow-tooltip/>-->

        <!--          <el-table-column prop="unitStart" label="占用机架起始位置"  show-overflow-tooltip/>-->
        <!--          <el-table-column prop="unitEnd" label="占用机架结束位置"  show-overflow-tooltip/>-->
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-auth="'iams_iamsShelf_edit'" icon="edit-pen" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button v-auth="'iams_iamsShelf_del'" icon="delete" text type="primary"
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

<script lang="ts" name="systemIamsShelf" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList} from "/@/api/iams/iamsShelf";
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
  downBlobFile('/iams/iamsShelf/export', Object.assign(state.queryForm, {ids: selectObjs}), 'iamsShelf.xlsx')
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