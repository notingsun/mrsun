<style lang='less' scoped>
@import "./describeconfig.less";
</style>
<template>
  <div>
    <Card>
      <div>
        编码库名称：
        <Select
          v-model="initModel"
          style="width:200px"
          @on-open-change="changeData"
          @on-change="getDescData"
        >
          <Option
            v-for="item in selectList"
            ref='optionData'
            :value="item.id"
            :key="item.id"
          >{{ item.libCatalogue }}</Option>
        </Select>
        &nbsp;&nbsp;&nbsp;
        编码库描述：{{ descData }}
      </div>
      <Tabs
        type="card"
        v-model="tabNum"
        style="padding-top:10px;"
      >
        <TabPane
          name="0"
          label="Commodity"
        >
          <div class="content">
            <div class="btn-bar">
              <Button
                type='info'
                icon='md-add'
                @click='createRow(0)'
              >新增</Button>
              <Button
                type='error'
                icon='md-remove'
                @click='deleteMtd'
                :disabled='CommodityData.length > 0 ? false : true'
              >删除</Button>
              <Button
                type='warning'
                icon='ios-search'
                @click='filterHandle(0)'
              >过滤</Button>
            </div>
            <div
              class="tablemain"
              v-if="isCol"
            >
              <filter-table
                ref="filterTable0"
                :columns='columns0'
                :lineData='CommodityData'
                :totalNum='CommodityDataTotalNum'
                @rowSave='handleSave'
                @Filter='startFilter'
                @TurnPage='PagingMtd0'
              >
              </filter-table>
            </div>
          </div>
        </TabPane>
        <TabPane
          name="1"
          label="Ident"
        >
          <div class="content">
            <div class="btn-bar">
              <Button
                type='info'
                icon='md-add'
                @click='createRow(1)'
              >新增</Button>
              <Button
                type='error'
                icon='md-remove'
                @click='deleteMtd'
                :disabled='CommodityData.length > 0 ? false : true'
              >删除</Button>
              <Button
                type='warning'
                icon='ios-search'
                @click='filterHandle(1)'
              >过滤</Button>
            </div>
            <div
              class="tablemain"
              v-if="isCol"
            >
              <filter-table
                ref="filterTable1"
                :columns='columns1'
                :lineData='IdentData'
                :totalNum='IdentDataTotalNum'
                @rowSave='handleSave'
                @Filter='startFilter'
                @TurnPage='PagingMtd1'
              >
              </filter-table>
            </div>
          </div>
        </TabPane>
        <TabPane
          name="2"
          label="Size Referece"
        >
          <div class="content">
            <div class="btn-bar">
              <Button
                type='info'
                icon='md-add'
                @click='createRow(2)'
              >新增</Button>
              <Button
                type='error'
                icon='md-remove'
                @click='deleteMtd'
                :disabled='CommodityData.length > 0 ? false : true'
              >删除</Button>
              <Button
                type='warning'
                icon='ios-search'
                @click='filterHandle(2)'
              >过滤</Button>
            </div>
            <div
              class="tablemain"
              v-if="isCol"
            >
              <filter-table
                ref="filterTable2"
                :columns='columns2'
                :lineData='sizeData'
                :totalNum='sizeTotalNum'
                @rowSave='handleSave'
                @Filter='startFilter'
                @TurnPage='PagingMtd2'
              >
              </filter-table>
            </div>
          </div>
        </TabPane>
      </Tabs>

    </Card>
  </div>
</template>
<script>
import FilterTable from "@/components/FilterTable/index.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { columns0, columns1, columns2 } from "./describeMock.js";
import moment from "moment";
export default {
  name: "DescribeConfigPage",
  data() {
    return {
      isCol: false,
      tabNum: 0,
      mainId: null, //编码库id
      initModel: null,
      selectList: null, //编码库名称下拉选数据
      descData: null, //编码库描述
      lineData: [], // 列表数据
      pageAble: {
        page: 0,
        size: 20
      },
      arr: [],
      sizeDict: [],
      CcUsage: [],
      columns0: columns0,
      columns1: columns1,
      columns2: columns2,
      table0Insert: {
        ccConfigId: null,
        libId: null,
        sortNumber: null,
        configName: null,
        configDesc: null
      },
      table2Insert: {
        ccConfigId: null,
        libId: null,
        sortNumber: null,
        configName: null,
        configDesc: null,
        measutrmentSystem: null
      }
    };
  },
  components: {
    FilterTable
  },
  computed: {
    ...mapGetters("describeconfig", [
      "CommodityData",
      "CommodityDataTotalNum",
      "IdentData",
      "IdentDataTotalNum",
      "sizeData",
      "sizeTotalNum"
    ]),
    libId() {
      if(this.mainId == null || this.mainId == undefined || this.mainId == "") {
          this.$Message.warning("请先选择编码库，后进行新建操作！");
        } else {
          return this.mainId
        }
    }
  },
  created() {
    this.getDict();
  },
  mounted() {},
  watch: {
    tabNum: {
      handler(newVal, oldVal) {
        if (newVal * 1 === 0) {
          this.getPropertyData();
        }
        if (newVal * 1 === 1) {
          this.getPropertyData();
        }
        if (newVal * 1 === 2) {
          this.getPropertyData();
        }
      },
      deep: true
    },
  },
  methods: {
    ...mapActions([
      "getCodeLibraryName", // 获取编码库名称
      "getCodeLibraryDesc", // 获取编码库描述
      "getDictItemsData" // 获取数据字典项
    ]),
    ...mapActions("describeconfig", [
      /**cc */
      "getCcConfig", //根据类型和编码库获取cc下拉选字典
      "getCcConfigsByCols", // 根据条件获取cc描述配置数据
      "createCcDescConfigs", // 创建描cc述配置数据
      "batchDeleteCcDescConfigs", // 批量删除cc描述配置数据
      /**ident */
      "createIdentDescConfigs", // 创建描ident述配置数据
      "getIdentDescConfigsByCols", // 根据条件获取ident描述配置数据
      "batchDeleteIdentDescConfigs", // 批量删除ident描述配置数据
      /**size */
      "getSizeDictItemsByDictCode", // 获取size下拉选
      "createSizeDescConfigs", // 创建描size述配置数据
      "getSizeDescConfigsByCols", // 根据条件获取size描述配置数据
      "batchDeleteSizeDescConfigs" // 批量删除size描述配置数据
    ]),
    // 根据KEY 返回下标
    findIndexMtd(arr, value) {
      return arr.findIndex(x => {
        return x.key == value;
      });
    },
    // 时间格式化方法
    vueMomentDate(arr) {
      let newar = new Array(2);
      if (arr && arr.length == 2) {
        arr.map((ele, index) => {
          if (ele == undefined || ele == "") {
            newar[index] = null;
          } else {
            newar[index] = moment(arr[index]).format("YYYY-MM-DD");
          }
        });
      } else {
        console.log("不合法的格式");
      }
      return newar;
    },
    // 分页
    PagingMtd0(page) {
      this.getCcConfigsByCols({libId: this.libId,...page})
    },
    PagingMtd1(page) {
      this.getIdentDescConfigsByCols({libId: this.libId,...page })
    },
    PagingMtd2(page) {
      this.getSizeDescConfigsByCols({ libId: this.libId, ...page })
    },
    // 获取下拉字典
    getDict() {
      this.getSizeDict();
    },
    // 获取Measurement System 下拉选
    getSizeDict() {
      this.getSizeDictItemsByDictCode({ dictCode: "Measurement System" }).then(
        res => {
          this.sizeDict = res;
          let val = {};
          val.colDict = res;
          val.key = "itemCode";
          val.name = "itemName";
          val.mult = false;
          let I = this.findIndexMtd(this.columns2, "measutrmentSystem");
          this.columns2[I].Val = val;
          console.log(this.columns2[I]);
        }
      );
    },
    // 获取Commodity Usage 下拉选
    getCcUsage(id,callback) {
      if (id !== null || id !== '' || id) {
        this.getCcConfig({ libId: id, configCategory: "D" }).then(
          res => {
            this.CcUsage = res;
            let val = {};
            val.colDict = res;
            val.key = "id";
            val.name = "configName";
            val.mult = false;
            let I = this.findIndexMtd(columns0, "ccConfigId");
            columns0[I].Val = val;
            this.columns0 = columns0;
            this.$nextTick(() => {
              this.isCol = true;
            })
            if(callback) callback(id)
          }
        );
      } else {
        // this.$Message.warning("请先选择编码库，后进行新建操作！");
      }
    },
    // 触发过滤方法
    startFilter(obj) {
      let param = this.dealFilterParam(obj);
      if (this.tabNum * 1 === 0) {
        this.getCcConfigsByCols({
          libId: this.libId,
          ...this.pageAble,
          ...param
        }).then(res => {});
      }
      if (this.tabNum * 1 === 1) {
        this.getIdentDescConfigsByCols({
          libId: this.libId,
          ...this.pageAble,
          ...param
        }).then(res => {});
      }
      if (this.tabNum * 1 === 2) {
        this.getSizeDescConfigsByCols({
          libId: this.libId,
          ...this.pageAble,
          ...param
        }).then(res => {});
      }
    },
    // 处理新增参数
    dealParameter(arr) {
      let newar = [];
      arr.map(ele => {
        let obj = {};
        obj.id = ele.id;
        obj.permissionType = ele.permissionType;
        obj.roleCode = ele.roleCode;
        obj.disciplineId =
          ele.disciplineId !== "" &&
          ele.disciplineId !== null &&
          ele.disciplineId.length > 0
            ? ele.disciplineId.join(",")
            : null;
        obj.authorityDescription = ele.authorityDescription;
        obj.authorityStatus = ele.authorityStatus == true ? 0 : 1;
        obj.libId = this.libId;
        newar.push(obj);
      });
      return newar;
    },
    // 处理过滤参数
    dealFilterParam(source) {
      let newar = [];
      let obj = {};
      for (const key in source) {
        if (key == "updDt") {
          let arr = this.vueMomentDate(source["updDt"]);
          obj["updDtBegin"] = arr[0];
          obj["updDtEnd"] = arr[1];
        } else if (key == "defDt") {
          let arr = this.vueMomentDate(source["defDt"]);
          obj["defDtBegin"] = arr[0];
          obj["defDtEnd"] = arr[1];
        } else {
          obj[key] = source[key];
        }
      }
      for (const key in obj) {
        if (obj[key] == null || obj[key] == "" || obj[key] == undefined) {
          delete obj[key];
        }
      }
      console.log(obj);
      return obj;
    },
    // 获取Commodity Usage 下拉选
    //  configCategory: 'D',
    // 获取 table data
    getPropertyData(id) {
      if (this.libId == null || this.libId == undefined || this.libId == "") {
        // this.$Message.warning("请先选择编码库，后进行新建操作！");
      } else {
        if (this.tabNum * 1 == 0) {
          this.getCcConfigsByCols({
            libId: id ? id : this.libId,
            ...this.pageAble
          }).then(res => {
            // this.lineData = res;
          });
        }
        if (this.tabNum * 1 == 1) {
          this.getIdentDescConfigsByCols({
            libId: id ? id : this.libId,
            ...this.pageAble
          }).then(res => {
            // this.lineData = res;
          });
        }
        if (this.tabNum * 1 == 2) {
          this.getSizeDescConfigsByCols({
            libId: id ? id : this.libId,
            ...this.pageAble
          }).then(res => {
            // this.lineData = res;
          });
        }
      }  
    },
    // 单行保存
    handleSave(param) {
      if (this.libId == null || this.libId == undefined || this.libId == "") {
        // this.$Message.warning("请先选择编码库，后进行新建操作！");
      } else {
        param.libId = this.libId;
        /**创建数据 0 1 2 ==> cc size id */
        if (this.tabNum * 1 === 0) {
          this.createCcDescConfigs(param).then(res => {
            if (res == 1) {
              this.$Message.success("保存成功");
              this.getPropertyData();
            }
          });
        }
        if (this.tabNum * 1 === 1) {
          this.createIdentDescConfigs(param).then(res => {
            if (res == 1) {
              this.$Message.success("保存成功");
              this.getPropertyData();
            }
          });
        }
        if (this.tabNum * 1 === 2) {
          this.createSizeDescConfigs(param).then(res => {
            if (res == 1) {
              this.$Message.success("保存成功");
              this.getPropertyData();
            }
          });
        }
      }
    },
    //新增
    createRow(num) {
      if (this.libId == null) {
        // this.$Message.warning("请先选择编码库，后进行新建操作！");
      } else {
        this.$refs[`filterTable${num}`].createRow(this[`table${num}Insert`]);
      }
    },
    // 删除
    deleteMtd() {
      this.$Modal.confirm({
        title: "操作提示",
        content: "<p>确认删除?</p>",
        onOk: () => {
          let num = this.tabNum*1;
          let ids = this.$refs[`filterTable${num}`].willDeleteIdArr;
          this.deleteWays(num,ids)
        },
        onCancel: () => {
          // this.$Message.info("Clicked cancel");
        }
      });
    },
    // 删除方法
    deleteWays(num,param) {
      if(num == 0) {
        this.batchDeleteCcDescConfigs(param).then(res => {
          if(res.status === 200) return 
        })
      }else
      if(num == 1) {
        this.batchDeleteIdentDescConfigs(param).then(res => {
          if(res.status === 200) return
        })
      }else
      if(num == 2) {
        this.batchDeleteSizeDescConfigs(param).then(res => {
          if(res.status === 200) return
        })
      }
      this.$Message.success("删除成功");
      this.getPropertyData()
    },
    // 点击过滤
    filterHandle(num) {
      this.$refs[`filterTable${num}`].filterHandle();
    },
    // 编码库操作
    changeData() {
      // 编码库下拉数据
      this.getCodeLibraryName().then(response => {
        this.selectList = response;
      });
    },
    // 选择编码库
    getDescData(data) {
      this.mainId = data;
      this.getCodeLibraryDesc({ id: data }).then(response => {
        this.descData = response;
        this.getCcUsage(data,this.getPropertyData())
        // this.getPropertyData(data);
      });
    },
    // 分页器
    pageTurnSu(page) {
      this.pageAble.page = page - 1;
      this.getPropertyData();
    },
    sizeTurnSu(size) {
      this.pageAble.size = size;
      this.getPropertyData();
    },
  }
};
</script>

