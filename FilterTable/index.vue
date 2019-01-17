<style scoped>
 .filterContent { padding-top: 15px;}
</style>
<template>
  <div>
    <div class="filterContent">
      <Table
        :columns="filterColumns"
        :data="table1data"
        border
        ref="table1"
        :key="1"
        v-show="isFilter"
      >
        <template
          slot='filterScoped'
          slot-scope='props'
        >
          <Input
            clearable
            v-if="props.type === 'input'"
            v-model="props.value"
            @on-enter='filterMtd(props)'
            @on-change='filterInputChange(props)'
          />
          <!--select-->
          <Select
            :transfer="true"
            clearable
            :multiple="props.mult"
            v-if="props.type === 'selection'"
            v-model="props.value"
            @on-change='filterMtd(props)'
          >
            <Option
              v-for="(item,index) in props.options"
              :value="item[props.key]"
              :key="index"
            >{{ item[props.name] }}</Option>
          </Select>
          <!--data picker-->
          <DatePicker
            :transfer="true"
            v-if="props.type === 'dataPicker'"
            v-model="props.value"
            type="daterange"
            placeholder="Select date"
            @on-change='filterMtd(props)'
          ></DatePicker>
        </template>
      </Table>
      <Table
        :columns="contentColums"
        :data="table2ListData"
        ref="table2"
        :key="2"
        border
        @on-select="onelineSelect"
        @on-select-all="tableSelectAll"
        @on-selection-change="SelectChange"
        :show-header='!isFilter'
      >
        <template
          slot='editScoped'
          slot-scope='props'
        >
          <div v-if="props.type === 'dealDiv'">{{props.value}}</div>
          <div v-if="props.btnType ==='editClick'">
            <Button
              size="small"
              type='success'
              @click='onEdit(props, 1)'
            >确定</Button>
            <Button
              size="small"
              type='error'
              @click='onEdit(props, 2)'
            >取消</Button>
          </div>
          <Button
            size="small"
            type='info'
            v-if="props.btnType === 'edit'"
            @click='onEdit(props, 0)'
          >{{props.content}}</Button>
          <Input
            clearable
            v-if="props.type === 'input'"
            v-model='props.value'
            @on-change='onInputChange(props)'
          />
          <!--checkbox-->
          <checkbox
            v-if="props.type === 'checkbox'"
            :disabled='!props.isEdit'
            v-model='props.value'
            :true-value='0'
            :false-value='1'
            @on-change='onInputChange(props)'
          />
          <!--select-->
          <Select
            :transfer="true"
            clearable
            :multiple="props.mult"
            v-if="props.type === 'selection'"
            v-model="props.value"
            @on-change='onInputChange(props)'
          >
            <Option
              v-for="(item,index) in props.options"
              :value="item[props.key]"
              :key="index"
            >{{ item[props.name] }}</Option>
          </Select>
          <!--data picker-->
          <DatePicker
            format='yyyy-MM-dd'
            @on-change='onInputChange(props)'
            :transfer="true"
            v-if="props.type === 'dataPicker'"
            v-model="props.value"
            type="date"
            placeholder="Select date"
          ></DatePicker>
        </template>
      </Table>
    </div>
    <div style="overflow:hidden;">
      <Page
        style="float:right;margin:10px 0 0 0;"
        :current='pageAble.page + 1'
        :total='totalNum'
        :page-size='pageAble.size'
        size='small'
        placement='top'
        @on-change='pageTurn'
        @on-page-size-change='sizeTurn'
        show-total
        show-elevator
        show-sizer
      />
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Tool from "./Tools";
// 过滤状态下拉选字典
const statusDict = [
  {
    itemCode: 0,
    itemName: "选中"
  },
  {
    itemCode: 1,
    itemName: "未选中"
  }
];
export default {
  name: "filtertable",
  props: ["columns", "lineData", "totalNum" ],
  data() {
    return {
      SelectRows:[],
      filterColumns:null,
      contentColums: null,
      table1data: [],
      isFilter: false,
      table2ListData: [],
      //分页信息
      pageAble: {
        page: 0,
        size: 20
      },
      filterData: {},
      editdata: {}
    };
  },
  computed: {
    filterTableData() {// 过滤table对象处理
      if (this.lineData && this.lineData.length > 0) {
        let obj = Tool.deepCopyObject(this.lineData[0]);
        for (const key in obj) obj[key] = null;
        obj._disabled = true;
        return obj;
      }
    },
    willDeleteIdArr() {// 删除ids
      if(this.SelectRows.length && this.SelectRows.length > 0) {
        let arr = this.SelectRows.map(ele => ele.id);
        let newar = [];
        arr.map(ele => {
          let obj = {};
          obj.id = ele;
          newar.push(obj)
        })
          return newar
      }else{
        return null
      }
    }
  },
  created() {
    this.renderStart()
  },
  mounted() {
    this.table2ListData = Tool.deepCopyObjArray(this.lineData)
  },
  watch: {
    lineData(val) {
      this.table2ListData = Tool.deepCopyObjArray(val)
    }
  },
  methods: {
    ...mapActions([
      "getCodeLibraryName", // 获取编码库名称
      "getCodeLibraryDesc", // 获取编码库描述
      "getDictItemsData" // 获取数据字典项
    ]),
    ...mapActions("accessconfig", [
      "DeleteMcrTAuthority", // 删除权限配置数据
    ]),
    renderStart() {
      this.filterColumns = Tool.deepCopyObjArray(this.columns);
      this.contentColums = Tool.deepCopyObjArray(this.columns);
      this.renderFiltertable(this.filterColumns);
      this.renderContet(this.contentColums);
    },
    // input 过滤判断
    filterInputChange(props) {
      if(props.value == '' || !props.value || props.value == null) {
        this.filterMtd(props)
      }
    },
    // 过滤方法
    filterMtd(p) {
      if(p) {
        if(p.logo) {
          this.filterData[p.logo] = p.value;
          this.$nextTick(() => {
            this.$emit('Filter',this.filterData)
          })
        }
      }
    },
    // 过滤btn Click
    filterHandle() {
      if (this.table2ListData.length > 0) {
        let arr = this.table2ListData.concat();
        if (this.isFilter == true) {
          arr.map(ele => {
            ele._disabled = false;
          })
          this.table2ListData = arr;
          this.isFilter = false;
        } else {
           arr.map(ele => {
            ele._disabled = true;
          })
          this.table2ListData = arr;
          this.table1data = [this.filterTableData];
          this.isFilter = true;
        }
      }
    },
    // 新增行
    createRow(instert) {
      this.table2ListData.unshift(this.insertLine(instert));
    },
    // 新增行处理
    insertLine(instert) {
      let obj = {};
      for (const key in instert) {
        obj[key] = null;
        obj["unsave"] = true;
      }
      return obj;
    },
    // 删除行
    deleteRow() {
      this.$Modal.confirm({
        title: "操作提示",
        content: "<p>确认删除?</p>",
        onOk: () => {
          // this.$emit('rowDelete',this.willDeleteIdArr)
        },
        onCancel: () => {
          // this.$Message.info("Clicked cancel");
        }
      });
    },
    // 
    onInputChange(p) {
      this.editdata[p.colKey] = p.value;
    },
    // 按钮操作
    onEdit(props, tip) {
      let index = props.index;
      if (tip == 0) {
        this.editdata = {};
        // 编辑
        this.table2ListData.map(ele => {
          delete ele.isEdit;
        });
        this.table2ListData[index].isEdit = true;
        this.$set(this.table2ListData, index, this.table2ListData[index]);
        this.editdata = Tool.deepCopyObject(this.table2ListData[index]);
      }
      if (tip == 1) {
        // 保存
        this.$emit("rowSave", this.editdata);
      }
      if (tip == 2) {
        // 取消
        if (
          this.table2ListData[index].unsave &&
          this.table2ListData[index].unsave == true
        ) {
          this.$Modal.confirm({
            title: "操作提示",
            okText: "是",
            cancelText: "否",
            content: "<p>当前行未保存,是否丢弃当前行?</p>",
            onOk: () => {
              this.$nextTick(() => {
                this.table2ListData.splice(index, 1);
              });
            },
            onCancel: () => {
              // this.$Message.info("Clicked cancel");
            }
          });
        } else {
          this.table2ListData[index].isEdit = false;
          this.$set(this.table2ListData, index, this.table2ListData[index]);
        }
      }
    },
    // 自定义渲染
    renderContet(col) {
      col.map((item, index) => {
        let key = item.key;
        let Val = item.Val;
        if (item.renderTip) {
          item.render = (h, params) => {
            let index = params.index;
            let row = params.row;
            let column = params.column;
            let rendercontent;
            // 未编辑状态
            if (!row.isEdit) {
              // seq 序号
              if (column.renderTip == "seq") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  value:
                    params.index + 1 + this.pageAble.page * this.pageAble.size
                });
              }
               //selection 回显
              if (column.renderTip == "selection") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  index: index,
                  value: Tool.dealSelectDict(
                    this.table2ListData[index][key],
                    Val.colDict,
                    Val.key,
                    Val.name
                  )
                });
              }
              //专业数据字典回显
              if (column.renderTip == "mult") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  index: index,
                  value: Tool.dealDisc(
                    this.table2ListData[index][key],
                    Val.colDict
                  )
                });
              }
              //默认展示无需处理div
              if (column.renderTip == "input") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  index: index,
                  value: this.table2ListData[index][key]
                });
              }
              // datePicker 日期
              if (column.renderTip == "date") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  value: this.table2ListData[index][key]
                });
              }
              // 按钮 编辑前
              if (column.renderTip == "edit-ok&cancel") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  btnType: "edit",
                  content: "edit",
                  index: index
                });
              }
              // checkbox 编辑前
              if (column.renderTip == "checkbox") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "checkbox",
                  isEdit: false,
                  value: row[key]
                });
              }
              // console.log(rendercontent);
              return h("div", rendercontent);
            }
            // 编辑状态
            if (row.isEdit) {
              // seq 序号
              if (column.renderTip == "seq") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  type: "dealDiv",
                  value:
                    params.index + 1 + this.pageAble.page * this.pageAble.size
                });
              }
              // edit-ok&cancel
              // 按钮 编辑中
              if (column.renderTip == "edit-ok&cancel") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  btnType: "editClick",
                  index: index
                });
              }
             
              // 角色编辑 selection
              if (column.renderTip == "selection") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  colKey: key,
                  type: "selection",
                  index: index,
                  value: row[key],
                  options: Val.colDict,
                  key: Val.key,
                  name: Val.name,
                  mult: Val.mult
                });
              }
              //Multselection 编辑下多选下拉框
              if (column.renderTip == "mult") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  colKey: key,
                  mult: true,
                  type: "selection",
                  index: index,
                  value: Tool.dealDisciplineReshow(
                    this.table2ListData[index][key],Val.colDict
                  ),
                  options: Val.colDict,
                  key: Val.key,
                  name: Val.name,
                });
              }
              //  编辑后变成输入框的
              if (column.renderTip == "input") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  colKey: key,
                  type: "input",
                  index: index,
                  value: this.table2ListData[index][key]
                });
              }
              // checkbox 编辑后
              if (column.renderTip == "checkbox") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  colKey: key,
                  type: "checkbox",
                  isEdit: true,
                  value: row[key]
                });
              }
              // datePicker 日期
              if (column.renderTip == "date") {
                rendercontent = this.$refs.table2.$scopedSlots.editScoped({
                  colKey: key,
                  type: "dataPicker",
                  value: this.table2ListData[index][key]
                });
              }
              // console.log(rendercontent);
              return h("div", rendercontent);
            }
          };
        }
      });
    },
    // filterTable 渲染
    renderFiltertable(col) {
      col.map((item, index) => {
        let key = item.key;
        let Val = item.Val;
        if (item.renderTip) {
          item.render = (h, params) => {
              let index = params.index;
              let row = params.row;
              let column = params.column;
              // let key = item.key;
              let rendercontent;
              //selection
              if (item.renderTip == "selection") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "selection",
                  index: index,
                  options: Val.colDict,
                  key: Val.key,
                  name: Val.name,
                  mult: false,
                  logo: key
                });
              }
              // 权限过滤
              if (item.renderTip == "permissionType") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "selection",
                  index: index,
                  options: this.dataDict,
                  key: "itemCode",
                  name: "itemName",
                  mult: false,
                  logo: key
                });
              }
              // 角色过滤
              if (column.renderTip == "role") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "selection",
                  index: index,
                  options: this.dataRoles,
                  key: "itemCode",
                  name: "itemName",
                  mult: false,
                  logo: key
                });
              }
              //Multselection 多选下拉框过滤
              if (column.renderTip == "mult") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  mult: true,
                  type: "selection",
                  index: index,
                  options: this.dataDisc,
                  key: "id",
                  name: "disciplineName",
                  logo: key
                });
              }
              // 输入框类型过滤
              if (column.renderTip == "input") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "input",
                  index: index,
                  logo: key
                });
              }
              // 勾选状态过滤
              if (column.renderTip == "checkbox") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "selection",
                  index: index,
                  options: statusDict,
                  key: "itemCode",
                  name: "itemName",
                  mult: false,
                  logo: key
                });
              }
              // datePicker 日期过滤
              if (column.renderTip == "date") {
                rendercontent = this.$refs.table1.$scopedSlots.filterScoped({
                  type: "dataPicker",
                  index: index,
                  logo: key,
                });
              }
              return h("div", rendercontent);
            };
        }
      });
    },
    SelectChange(data) {
      // debugger
      console.log(data)
      this.SelectRows = data;
    },
    onelineSelect(data) {},
    tableSelectAll(data) {},
    pageTurn(page) {
      this.pageAble.page = page - 1;
      this.$emit('TurnPage',this.pageAble);
    },
    sizeTurn(size) {
      this.pageAble.size = size;
      this.$emit('TurnPage',this.pageAble);
    },
  }
};
</script>
